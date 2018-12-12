function App() {
    this.len= [];
    this.right= [];
    this.already= [];
    this.isFirst= true;
    this.M_lenX=0;
    this.M_lenY=0;
    this.M_len=0;

    this.leftClick= false;
}
/* 난이도 선택 */
App.prototype.eventInit = function() {
    var self= this;
    window.oncontextmenu= function (e){ e.preventDefault();}
    var btn= document.getElementById("btn");
    btn.addEventListener("click", function (){
        switch (document.querySelector("input[type=radio]:checked").value) {
            case "1":
                self.SetLength(9, 9);
                break;
            case "2":
                self.SetLength(16, 16);
                break;
            case "3":
                self.SetLength(16, 30);
                break;
            default:
                alert('선택해주세요');
                return false;
        }
    });
};
App.prototype.SetLength = function(x, y) {// set Array length, addHTML
    this.M_lenX= x;
    this.M_lenY= y;
    this.len= this.AddArray(x, y);
    console.log(this.len);
    this.AddHTML(x, y);
};
App.prototype.AddArray = function (x, y){// return array
    var array = [];
    for (var i = 0; i < x; i++) {
        array[i]= [];
        for(var j= 0; j< y; j++){
            array[i].push([0, 0, 0]);//(mine, number), right, already
        }
    }
    return array;
};
App.prototype.AddHTML = function (x, y){// body.innerHTML, this.start();
    var code="<div id='wrap'><div class='mask'></div><ul id='plate'>";
    for (var i = 0; i < x; i++) {
        code += `<li class='b'>`;
        for (var j = 0; j < y; j++) {
            if (j == 0)
                code += ` <ul>`;
            code += `   <li class='c'></li>`;
            if (j == y - 1)
                code += ` </ul>`;
        }
        code += `</li>`;
    }
    code+="</ul></div>";
    document.body.innerHTML= code;
    var wrap= document.querySelector("#wrap");
    wrap.style.width= y*30+"px";
    wrap.style.height= x*30+"px";
    this.start();
};
/* //난이도 선택 */
/* 난이도 선택 후 */
App.prototype.addEvent = function(event) {
    var self= this;
    for(var i=0; i<event.length; i++){
        window.addEventListener(event[i], function (e){
            e.preventDefault();
            var _this= e.target;
            if(_this.className=="c"){
                var parent= e.target.parentNode.parentNode;
                var x= [].slice.call(e.target.parentNode.children).indexOf(e.target);// this
                var y= [].slice.call(parent.parentNode.children).indexOf(parent);// parent
                switch(e.type) {
                    case "click":
                        if (self.isFirst) { //처음
                            self.isFirst= false; //다음클릭부터는 처음이 아님
                            self.MakeMine(x, y); //지뢰 생성
                        }
                        if(self.len[y][x][1] == 0 && self.len[y][x][1] == 0){
                            self.onClick(x, y, _this);
                            self.len[y][x][2] = 1;
                        }
                        break;
                    case "mousedown":
                        if (e.button == 0) {
                            self.leftClick = true;
                        }
                        if (e.button == 2) {
                            if (self.leftClick && self.len[y][x][1] == 0) {
                                if(self.len[y][x][2] == 0)
                                    return;
                                var M=0;
                                for(var i= -1; i<2; i++){
                                    for(var j= -1; j<2; j++){
                                        if(self.len[y + i] != undefined && self.len[y + i][x + j] != undefined && self.len[y + i][x + j][1] == 1){
                                            M++;
                                        }
                                    }
                                }
                                if(Number(_this.innerText) == M){
                                    self.NoNumber(x, y);
                                }
                            } else {
                                if (self.len[y][x][2] == 0) {
                                    if (self.len[y][x][1] == 0) {
                                        self.len[y][x][1] = 1;
                                        _this.style.background = 'rgb(10, 39, 69)';
                                    } else {
                                        self.len[y][x][1] = 0;
                                        _this.style.background = 'rgb(45, 136, 231)';
                                    }
                                }
                            }
                        }
                        break;
                    case "mouseup":
                        if(!self.isFirst){
                            var Mlen= self.M_len;
                            for (var i = 0; i < self.M_lenY; i++) {
                                for (var j = 0; j < self.M_lenX; j++) {
                                    if (self.len[i][j][1] == 1 && self.len[i][j][0] == true) {
                                        Mlen--;
                                    }
                                }
                            }
                            if (Mlen == 0) {// clear
                                console.log('clear');
                                self.end();
                            }
                        }
                        if(e.button == 0)
                            self.leftClick= false;
                        break;
                }
            }
        })
    }
};
App.prototype.start = function (){
    var self= this;
    var block= document.querySelectorAll(".c");//지뢰 칸
    this.addEvent(["click", "mousedown", "mouseup"]);
};
App.prototype.MakeMine = function(x, y, callback) {
    switch (this.M_lenY) {
        case 9:
            this.M_len = 10;
            break;
        case 16:
            this.M_len = 40;
            break;
        case 30:
            this.M_len = 99;
            break;
        default:
    }
    for (i = 0; i < this.M_len; i++) { //지뢰개수만큼 for문을 돌림
        this.addMine(x, y, i);
    }
};
App.prototype.addMine = function(x, y, i) { // 지뢰추가해줌
    var Rx = Math.floor(Math.random() * (this.M_lenX));
    var Ry = Math.floor(Math.random() * (this.M_lenY));
    if (this.CheckLocation(x, y, Rx, Ry)) {
        this.addMine(x, y, i);
    } else {
        if (this.len[Ry][Rx][0] === true) {
            this.addMine(x, y, i);
        } else {
            this.len[Ry][Rx][0] = true;
            this.addNumber(Rx, Ry);
            return;
        }
    }
};
App.prototype.CheckLocation = function(x, y, Rx, Ry) {//클릭한곳 주위인지 체크
    var min= Math.min(x, Rx);
    var max= Math.max(x, Rx);
    switch (max - min) {
        case 0:
        case 1:
            min= Math.min(y, Ry);
            max= Math.max(y, Ry);
            switch (max - min) {
                case 0:
                case 1:
                    return true;
                    break;
                default:
                    return false;
            }
            break;
        default:
            return false;
    }
};
App.prototype.addNumber = function(x, y) {// 지뢰주위 숫자 증가
    for (var q = -1; q <= 1; q++) {
        for (var w = -1; w <= 1; w++) {
            if (y + q >= 0 && y + q < this.M_lenX) {
                if (x + w >= 0 && x + w < this.M_lenY) {
                    if (this.len[y + q][x + w][0] !== true)
                        this.len[y + q][x + w][0]++;
                }
            }
        }
    }
};
App.prototype.onClick = function(x, y, _this) {
    switch (this.len[y][x][0]) {
        case false:
            break;
        case 0:
            this.len[y][x][0] = false;
            _this.style.background= "gray";
            this.NoNumber(x, y);
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            _this.innerText= this.len[y][x][0];
            _this.style.background= "gray";
            break;
        case true:
            console.log("지뢰클릭");
            this.end();
            break;
        default:
            break;
    }
};
App.prototype.NoNumber = function(x, y) {
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (y + i >= 0 && y + i < this.M_lenY) {
                if (x + j >= 0 && x + j < this.M_lenX) {
                    if (i != 0 || j != 0) {
                        document.querySelectorAll('#plate>li')[y + i].querySelectorAll('li')[x + j].click();
                    }
                }
            }
        }
    }
};
App.prototype.end = function() {
    for(var i=0; i<this.M_lenY; i++){
        for(var j=0; j<this.M_lenX; j++){
            var _this= document.querySelectorAll("#plate>li")[i].querySelectorAll("li")[j];
            console.log(_this);
            switch (this.len[i][j][0]) {
                case false:
                    break;
                case 0:
                    _this.innerText= "";
                    _this.style.backgroundColor= "gray";
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    _this.innerText= this.len[i][j][0];
                    _this.style.backgroundColor= "gray";
                    break;
                case true:
                    _this.innerText= "";
                    _this.style.backgroundColor= "#000";
                    break;
                default:
                    break;
            }
        }
    }
    console.log('a');
    document.querySelector(".mask").style.display= "block";
};
/* //난이도 선택 후 */
window.onload= function (){
    var app= new App();
    app.eventInit();
}

// $(document).on('click', '.c', function(e) { //좌클릭 이벤트
//     cy = $(this).index(); // 가로
//     cx = $(this).parents('.b').index(); // 세로
//     if (first) { //처음
//         first = false; //다음클릭부터는 처음이 아님
//         mine(cx, cy); //지뢰 생성
//         starttime = 0;
//         _MineTime();
//     } else {}
//     if (right == 0 || !right[cx][cy]) { //클릭한곳에 지뢰표시가 안돼있으면
//         already[cx][cy] = 1;
//         $(this).css({
//             background: 'gray'
//         });
//         click(cx, cy, $(this)); //클릭\
//     }
// });
// let left = false;
// $(document).on('mousedown', '.c', function(e) {
//     ry = $(this).index(); // 가로
//     rx = $(this).parents('.b').index(); // 세로
//     if (e.button == 0) {
//         left = true;
//     }
//     if (e.button == 2) {
//         if (left && right[rx][ry] != 1) {
//             for (var i = 0; i < x; i++) {
//                 console.log(i);
//                 if (already[i].indexOf(1) != -1) {
//                     no(rx, ry);
//                     return false;
//                 }
//             }
//         } else {
//             if (!already[rx][ry]) {
//                 if (!right[rx][ry]) {
//                     right[rx][ry] = 1;
//                     this.style.border = '2px solid #000';
//                     this.style.background = 'rgb(10, 39, 69)';
//                 } else {
//                     right[rx][ry] = 0;
//                     this.style.border = '1px solid #fff';
//                     this.style.background = 'rgb(45, 136, 231)';
//                 }
//             }
//         }
//     }
// }).on('mouseup', '.c', function(e) {
//     var mine_stack = mine_length;
//     for (var i = 0; i < x; i++) {
//         for (var j = 0; j < y; j++) {
//             if (right != 0 && right[i][j] === 1) {
//                 mine_stack--;
//                 over_stack++;
//             } else if (already[i][j] === 1) {
//                 over_stack++;
//             }
//         }
//     }
//     $('.m>span').text(mine_stack);
//     if (over_stack == x * y) {
//         clearInterval(mt);
//         $('body').prepend(`${starttime}초. 클리어`);
//     } else {
//         over_stack = 0;
//     }
//     if (e.button == 0) left = false;
// });

function click(clx, cly, cli) {
    switch (len[clx][cly]) {
        case false:
            break;
        case 0:
            len[cx][cy] = false;
            no(clx, cly);
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            cli.text(len[clx][cly]);
            break;
        case true:
            cli.css({
                background: 'black'
            });
            if (!over) {
                clearInterval(mt);
                $('body').prepend(`${starttime}초. 까비`);
                over = true;
                right = 0;
                $('body').prepend(`<div id='stop'></div>`);
                $('.c').click();
            }
            break;
        default:
            break;
    }
}
