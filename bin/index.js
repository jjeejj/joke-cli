#! /user/bin/env node

const superAgent = require('superagent');
const cheerio = require('cheerio');
const readline  = require('readline');
const colors = require('colors');

const rl = readline.createInterface({
    input:process.stdin,
    output: process.stdout,
    prompt:'😆 您正在使用joke-cli,按下回车查看笑话 😜 >>>'
});


let url = 'http://www.qiushibaike.com/text/page/'
let page = 1;

let jokeStories  = []; //用来存放笑话

//请求笑话并添加到数组中
function requestJoke() {
    if(jokeStories.length < 3){ //当笑话小于3条是，请求新的一页数据
        superAgent
            .get(url+page)
            .end((err,res)=>{
                if(err) console.log(err);

                const $ = cheerio.load(res.text);
                // console.log('res.text',res.text);
                let jokeList = $('div.article .content span');

                // console.log('jokeList',jokeList);

                // let jokeListArr = Array.from(jokeList);

                // Arraty.prototype.forEach.call(jokeList,)
                Array.prototype.forEach.call(jokeList,function (joke,index) {
                    jokeStories.push($(joke).text())
                });

                // console.log('jokeStories',jokeStories)

                //请求的页码加1
                page ++;
            })
    }
};
requestJoke();

rl.prompt();

//监听控制台输入的内容
rl.on('line',(line)=>{
    if(jokeStories.length > 0){
        console.log('======================')
        console.log(jokeStories.shift().bgCyan.black);
        requestJoke();
    }else{
        console.log('请稍后.....'.green);
    }
}).on('cloes',()=>{
    console.log('Bye!');
    process.exit();
}).on('error',()=>{
    process.exit();
})
