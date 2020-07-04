'use strict';

const Controller = require('egg').Controller;
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken') //引入jsonwebtoken
var UUID = require('uuid');
var sha1 =require("sha1");
var tushare =require("tushare");
var {stock} = tushare;
//import { stock } from 'tushare';

function Success(data,msg) {
  return { "data": data, "code": 100, "msg": msg };
}


function error(data,msg){
  return { "data": data, "code": -1, "msg": msg };
}

class HomeController extends Controller {

  async loginToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires
    const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem')) // 私钥，看后面生成方法
    const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
    return token
  }

  async register() {
    const { app,ctx } = this;
    if(this.ctx.request.body.account!=null && this.ctx.request.body.password!=null && this.ctx.request.body.username!=null){
      let data = await app.model.User.findAll({
        where:{
          account: ctx.request.body.account,
        }
      });
      if(data.length>0){
        ctx.body = error("-1","账号已注册")
      }else{
        const uuid = UUID.v1();
        let usersData = {corpid: "butcher",userid: uuid};
        let pas = sha1(ctx.request.body.password)
        const token = await this.loginToken({ corpid: usersData.corpid, userid: uuid }, 7200) // token生成
        await app.redis.set(usersData.corpid + usersData.userid, token, 'ex', 7200) // 保存到redis
        await app.model.User.create({
          userid: uuid,
          account: ctx.request.body.account,
          password: pas,
          username: ctx.request.body.username,
          phone: 0,
          experience: parseInt(ctx.request.body.experience),
          token: token
        }).then(function(result){
          console.log("插入操作成功"+result);
          let obj = {};
          obj = JSON.parse(JSON.stringify(result));
          obj['token'] = token;
          delete obj.password;
          ctx.body = Success(obj,'注册成功')
        }).catch(function(err){
          ctx.body = error(err,'注册失败') 
        })
      }
    }else{
      ctx.body = error("-1","账户信息不完整") // 返回前端
    }
  }

  async login() {
    const { app,ctx } = this;
    let data;
    if(this.ctx.request.body.account!=null && this.ctx.request.body.password!=null){
      data = await app.model.User.findAll({
        where:{
          account: ctx.request.body.account,
          password: sha1(ctx.request.body.password)
        },
        include: [
          {
            attributes: ['code'],
            model: app.model.Collection
          }
        ],
        attributes: { exclude: ['password'] }
      });
    }
    if(data.length>0){
      const token = await this.loginToken({ corpid: "butcher", userid: data[0].userid }, 7200) // token生成
      await app.redis.set("butcher" + data[0].userid, token, 'ex', 7200) // 保存到redis\
      let obj = {};
      obj = JSON.parse(JSON.stringify(data[0]));
      obj['token'] = token;
      //ctx.body = { data: obj,code: 100, msg: '登录成功' } 
      ctx.body = Success(obj,'登录成功')
    }else{
      ctx.body = error("-1","账号密码不正确") // 返回前端
    }
  }

  async collection(){
    const { app,ctx } = this;
    if(this.ctx.request.body.code!=null){
      if(this.ctx.request.body.status==1){
        await app.model.Collection.create({
          userid: ctx.locals.userid,
          code: ctx.request.body.code
        }).then(function(result){
          ctx.body = { code: 1, msg: '收藏成功' } 
        }).catch(function(err){
          ctx.body = { data: err, code: -1, msg: '收藏失败' } 
        })
      }else{
        await app.model.Collection.destroy({
          where: {
            code: ctx.request.body.code,
            userid: ctx.locals.userid,
          }
        }).then(function(result){
          ctx.body = { code: 1, msg: '取消收藏成功' } 
        }).catch(function(err){
          ctx.body = { data: err, code: -1, msg: '取消收藏失败' } 
        })
      }
    }else{
      ctx.body = { code: ctx.locals.userid, msg: '参数为空' } // 返回前端
    }
  }

  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  // 获取学生信息 通过一对多的联系
  async info(){
    const { ctx, app } = this;
    let result = await app.model.Student.findAll({
      include: {
        model: app.model.Info
      }
    });
    ctx.body = result;
  }
  // 获取班级名为 软件工程1601 的班级学生
  async student(){
    const { ctx, app } = this;
    let result = await app.model.Classes.findAll({
      where: {
        name: '软件工程1601'
      },
      include: {
        model: app.model.Student
      }
    })
    ctx.body = result;
  }
  // 获取学生的选课内容
  async lession(){
    const { ctx, app } = this;
    let result = await app.model.Student.findAll({
      where:{
        id: 1,
      },
      include: [
        {model: app.model.Info},
        {model: app.model.Lession}
      ]
    });
    ctx.body = result;
  }
  // 获取某个课的参课学生
  async lessionStudent(){
    const { ctx, app } = this;
    let result = await app.model.Lession.findAll({
      where:{
        name: '网络安全'
      },
      include: {
        model: app.model.Student,
        include: {
          model: app.model.Info
        }
      }
    });
    ctx.body = result;
  }
   
  async Tarticle(){
    const { ctx, app } = this;
    let page = 1;
    let size = 10;
    console.log(this.ctx.query.page,'这是页码');
    if(parseInt(this.ctx.query.page)>0 && parseInt(this.ctx.query.size)>0){
      page = parseInt(this.ctx.query.page)
      size = parseInt(this.ctx.query.size)
    }
    let result = await app.model.TArticle.findAll({
      limit: size,
      offset: (page - 1) * 10,
      order: [
        ['createtime', 'DESC']
      ]
    });
    ctx.body = Success(result,"访问成功");
  }

  async getjinshi() {
    const { ctx, app } = this;
    let page = 1;
    let size = 10;
    console.log(this.ctx.query.page,'这是页码');
    if(parseInt(this.ctx.query.page)>0 && parseInt(this.ctx.query.size)>0){
      page = parseInt(this.ctx.query.page)
      size = parseInt(this.ctx.query.size)
    }
    let result = await app.model.Jinshi.findAndCountAll({
      limit: size,
      offset: (page - 1) * 10,
      order: [
        ['createtime', 'DESC']
      ]
    });
    ctx.body = Success(result,"访问成功");
  }

  async codedata() {
    const { ctx, app } = this;
    let type = 1;
    let page = 1;
    let size = 10;
    if(parseInt(this.ctx.query.type)>0 && parseInt(this.ctx.query.page)>0 && parseInt(this.ctx.query.size)>0){
      type = parseInt(this.ctx.query.type)
      page = parseInt(this.ctx.query.page)
      size = parseInt(this.ctx.query.size)
    }
    let result = await app.model.Codemodel.findAll({
      limit: size,
      offset: (page - 1) * 10,
      where:{
        'type': type,
      }
    });
    ctx.body = result;
  }

  async getTodayAll() {
    const { ctx, app } = this;
    var result;
    let page = 0;
    let size = 10;
    if(parseInt(this.ctx.query.page)>0){
      page = parseInt(this.ctx.query.page)
    }
    await stock.getTodayAll({
      pageSize: 10,
      pageNo: page
    }).then(({ data }) => {
      result = data
    });
    ctx.body = { data: result, msg: 'Success' };
  }

  async getIndex() {
    const { ctx, app } = this;
    var result;
    let page = 0;
    let size = 10;
    if(parseInt(this.ctx.query.page)>0){
      page = parseInt(this.ctx.query.page)
    }
    await stock.getIndex().then(({ data }) => {
      result = data;
    });
    ctx.body = { data: result, msg: 'Success' };
  }

  async getSinaDD() {
    const { ctx, app } = this;
    var result;
    let code = '600848';
    let volume = 400;
    
    if(parseInt(this.ctx.query.code)>0 && parseInt(this.ctx.query.volume)>0){
      code = parseInt(this.ctx.query.code)
      volume = parseInt(this.ctx.query.volume)
    }
    await stock.getSinaDD({ code: code,volume: volume }).then(({ data }) => {
      result = data;
    });
    ctx.body = { data: result, msg: 'Success' };
  }

  async getSinaIndustryClassified() {
    const { ctx, app } = this;
    var result;
    await stock.getSinaIndustryClassified().then(({ data }) => {
      result = data;
    });
    ctx.body = Success(result,"请求成功");
  }

  async getlhb() {
    const { ctx, app } = this;
    var result;
    var options = {
      start: '2020-02-21',
      end: '2020-02-21',
      pageNo: 1,
      pageSize: 10
    };
    if(parseInt(this.ctx.query.page)>0){
      options.pageNo = parseInt(this.ctx.query.page)
    }
    await stock.lhb(options).then(({ data }) => {
      result = data;
    });
    ctx.body = { data: result, msg: 'Success' };
  }

  async getSinaClassifyDetails() {
    const { ctx, app } = this;
    var result;
    var options = {
      tag: 'new_jrhy'
    };
    if(this.ctx.query.tag){
      options.tag = this.ctx.query.tag
    }
    await stock.getSinaClassifyDetails(options).then(({ data }) => {
      result = data;
    });
    ctx.body = Success(result,"请求成功");
  }

  async getLiveData() {
    const { ctx, app } = this;
    var result;
    var options = {
      codes: [
        '600848'
      ]
    };
    await stock.getLiveData(options).then(({ data }) => {
      result = data;
    });
    ctx.body = Success(result,"请求成功");
  }

  async getTodayTick() {
    const { ctx, app } = this;
    var result;
    var options = {
      code: '600848',
      end: '15:00:00'
    };
    await stock.getTodayTick(options).then(({ data }) => {
      result = data;
    });
    ctx.body = Success(result,"请求成功");
  }

}



module.exports = HomeController;
