function App() {
    this.len= [];
    this.right= [];
    this.already= [];
    this.isFirst= true;
    this.M_lenX=0;
    this.M_lenY=0;
    this.M_len=0;
}
/* 난이도 선택 */
App.prototype.eventInit = function() {
    var self= this;
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
    this.right= this.AddArray(x, y);
    this.already= this.AddArray(x, y);
    this.AddHTML(x, y);
};
App.prototype.AddArray = function (x, y){// return array
    var array = [];
    for (var i = 0; i < x; i++) {
        array[i]= [];
        for(var j= 0; j< y; j++){
            array[i].push(0);
        }
    }
    return array;
};
App.prototype.AddHTML = function (x, y){// body.innerHTML, this.start();
    var code="<div id='wrap'><ul id='plate'>";
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
App.prototype.start = function (){
    var self= this;
    var block= document.querySelectorAll(".c");//지뢰 칸
    for(var i= 0; i< block.length; i++){
        block[i].addEventListener("click", function (){
            var parent= this.parentNode.parentNode;
            var cx= [].slice.call(this.parentNode.children).indexOf(this);// this
            var cy= [].slice.call(parent.parentNode.children).indexOf(parent);// parent
            if (self.isFirst) { //처음
                self.isFirst= false; //다음클릭부터는 처음이 아님
                self.MakeMine(cx, cy); //지뢰 생성
            }
            self.onClick(cx, cy, this);
            this.style.background= "gray";
            // if (self.right[cy][cx] === 0 || !right[cx][cy]) { //클릭한곳에 지뢰표시가 안돼있으면
            //     already[cx][cy] = 1;
            //     $(this).css({
            //         background: 'gray'
            //     });
            //     click(cx, cy, $(this)); //클릭\
            // }
        });
    }
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
        if (this.len[Ry][Rx] === true) {
            this.addMine(x, y, i);
        } else {
            this.len[Ry][Rx] = true;
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
App.prototype.addNumber = function(x, y) {
    for (var q = -1; q <= 1; q++) {
        for (var w = -1; w <= 1; w++) {
            if (y + q >= 0 && y + q < this.M_lenX) {
                if (x + w >= 0 && x + w < this.M_lenY) {
                    if (this.len[y + q][x + w] !== true)
                        this.len[y + q][x + w]++;
                }
            }
        }
    }
};
App.prototype.onClick = function(x, y, _this) {
    switch (this.len[y][x]) {
        case false:
            break;
        case 0:
            this.len[y][x] = false;
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
            _this.innerText= this.len[y][x];
            break;
        case true:
            console.log("지뢰클릭");
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

function no(nx, ny) {
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (nx + i >= 0 && nx + i < x) {
                if (ny + j >= 0 && ny + j < y) {
                    if (i != 0 || j != 0) {
                        $('#plate>li').eq(nx + i).find('li').eq(ny + j).click();
                    }
                }
            }
        }
    }
}
let mine_length; // 지뢰개수
let mx;
let my;

function mine(n, n2) { //x, y
    switch (y) {
        case 9:
            mine_length = 10;
            break;
        case 16:
            mine_length = 40;
            break;
        case 30:
            mine_length = 99;
            break;
        default:
    }
    for (i = 0; i < mine_length; i++) { //지뢰개수만큼 for문을 돌림
        makemine(n, n2, i);
    }
}

function makemine(mmx, mmy, i) {
    mx = Math.floor(Math.random() * (x)); //랜덤좌표
    my = Math.floor(Math.random() * (y)); //랜덤좌표
    if (where(mx, my, mmx, mmy)) {
        makemine(mmx, mmy);
    } else {
        if (len[mx][my] === true) {
            makemine(mmx, mmy);
        } else {
            // 지금만확인
            // $('#plate>li').eq(mx).find('li').eq(my).css({background:'#000'});
            // 지금만확인
            return len[mx][my] = true, number(mx, my);
        }
    }
}

function where(wx, wy, cwx, cwy) {
    switch (cwx - wx) {
        case -1:
        case 0:
        case 1:
            switch (cwy - wy) {
                case -1:
                case 0:
                case 1:
                    return true;
                    break;
                default:
            }
            break;
        default:
            return false;
    }
}

function number(nx, ny) { //8,7
    for (var q = -1; q <= 1; q++) {
        for (var w = -1; w <= 1; w++) {
            if (nx - q >= 0 && nx - q < x) {
                if (ny - w >= 0 && ny - w < y) {
                    if (len[nx - q][ny - w] !== true) { //len[7][6]len[7][7]len[7][8]
                        len[nx - q][ny - w]++;
                        // 지금만 확인
                        // $('#plate>li').eq(nx-q).find('li').eq(ny-w).text(len[nx-q][ny-w]);
                        // 지금만 확인
                    }
                }
            } else {}
        }
    }
}