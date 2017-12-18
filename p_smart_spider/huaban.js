const http = require('http');
const cheerio = require('cheerio');
const querystring = require('querystring');
const fs = require('fs');
//D:\images_by_node\huaban
//目标哦 ：http://huaban.com/explore/uijiemian/?jb7kde8v&max=1270039727&limit=20&wfl=1
//目标哦
//目标哦
let hasCount=0
function spiderHuaban(path) {

  if(hasCount>=urlArr.length-1){
    return;
  }
    hasCount++;

    let postData = querystring.stringify({});

    let options = {
        hostname: 'huaban.com',
        port: 80,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',

            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            'X-Request': 'JSON',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'http://huaban.com/explore/uijiemian/'

        }
    };
    const req = http.request(options, (res) => {
        console.log("响应头: " + JSON.stringify(res.headers) + "\n");
        console.log(res)
        console.log("状态码:" + res.statusCode + "\n");
        res.setEncoding('utf8');
        let html = '',
            $,
            imgArr = [];
        res.on('data', (resData) => {
            // process.stdout.write(d) //print html
            html += resData;

        });

        //!!!!!监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function() {
            console.log('响应中已无数据。'
            // ,html
            // ,JSON.parse(html).keyword_id
            );
            // var html = iconv.decode(html, 'gb2312')

            // $=cheerio.load(html);
            //
            // let imgDomLi=$('#waterfall .pin').find('img');
            // console.log(imgDomLi)
            // console.log($('body').html())
            // // if(imgDomLi.length>0){
            //   console.log('dom:'+imgDomLi.length)
            //   imgDomLi.each(function(i,elem){
            //     imgArr[i]=$(this).attr('src');
            //     console.log(imgArr[i])
            //   })
            // // }
            //
            let imgArr = [],
                obj = JSON.parse(html),
                imgArrPins = obj.pins;
            for (let i in imgArrPins) {
                let obj = {
                    name: imgArrPins[i].raw_text + '.png',
                    file: 'http://img.hb.aicdn.com/' + imgArrPins[i].file.key
                };
                imgArr.push(obj)
                saveImage(obj)
                spiderHuaban(urlArr[hasCount]);
            }

            // console.log(imgArr)

        })
    });
    req.on('error', (e) => {
        console.error(e)
    })

    // 写入数据到请求主体
    req.write(postData);
    req.end();
    function saveImage(obj) {
        //采用request模块，向服务器发起一次请求，获取图片资源

        let file = obj.file,
            name = obj.name;

        http.get(obj.file, function(res) {
            var imgData = "";
            res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

            res.on("data", function(chunk) {
                imgData += chunk;
            });

            res.on("end", function() {
                fs.writeFile('./images/' + name, imgData, "binary", function(err) {
                    if (err) {
                        console.log("down fail");
                    }else{
                        console.log("down success");
                    }

                });
            });
        });

    }
}

//异步 花瓣网
let urlArr = [
    '/explore/uijiemian/?jb7kde8v&max=1270039727&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hp&max=1240726663&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hq&max=1229051309&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hr&max=1218273062&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hs&max=1216597488&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65ht&max=1215420984&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hu&max=1213551921&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hv&max=1195198735&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hw&max=1147615870&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hx&max=1142501117&limit=20&wfl=1',
    '/explore/uijiemian/?jb7kde8v=&max=1270039727&limit=20&wfl=1&jb7q65hy&max=1140189491&limit=20&wfl=1'

];

spiderHuaban(urlArr[0])
