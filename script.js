 $('body').css({'cursor':'context-menu'}).on('dragstart selectstart contextmenu',function () {//선택못하게
   return false;
 });
$(window).resize(function () {//윈도우의 크기가 바껴도 중앙에 있게
  $('#wrap').css({
    top: ($(window).height() - $('#wrap').height()) / 2,
    left: ($(window).width() - $('#wrap').width()) / 2
  });
  $('.w').css({
    top: parseInt($('#wrap').css('top'), 10)+$('#wrap').height(),
    left: parseInt($('#wrap').css('left'), 10),
  });
});

$(document).on('keydown',function (e) {// 처음 난이도 선택창에서 방향키로 선택을 바꿀수있고 엔터키로 시작할수있게
  switch (e.keyCode) {
    case 40://아래
    case 38://위
      for(var i=1;i<=3;i++){
        b=document.getElementById(`b${i}`);
        if(b.checked){
          if(e.keyCode==40){
            $(`#b${i+1}`).prop('checked',true);
          }else if(e.keyCode==38){
            $(`#b${i-1}`).prop('checked',true);
          }
          return;
        }
      }
      break;
    case 13://엔터
      $('#btn').click();
      break;
    default:

  }
})
let len;// 배열
let right;// 우클릭 배열
let already;// 클릭 배열
let code='';// html추가하는 코드
let bool;// 몇번째 난이도인지
let b;// 인풋
let x;// 길이
let y;// 길이
$('#btn').on('click',function () {// 시작버튼을 누르면
  for(var i=0;i<=2;i++){
    b=document.getElementById(`b${i+1}`);
    if(b.checked){
      bool=i;
    }
  }
  makeplate(bool);
});
function makeplate(b) {// 난이도를 받아와서 크기생성함
  switch (b) {
    case 0:
      pluscode(9,9);
    break;
    case 1:
      pluscode(16,16);
    break;
    case 2:
      pluscode(16,30);
    break;
    default:
    alert('선택해주세요');
    return false;
  }
  $('#mask').remove();
  $('#wrap, .w').show();
}
function pluscode(x1,y1) {//생성하고 li크기조정
  x=x1;
  y=y1;
  len=makearray(x1);
  right=makearray(x1);
  already=makearray(x1);
  for (var i = 0; i < x1; i++) {
    code+=`<li class='b'>`;
    for (var j = 0; j < y1; j++) {
      if(j==0)
      code+=` <ul>`;
      code+=`   <li class='c'></li>`;
      if(j==y1-1)
      code+=` </ul>`;
    }
    code+=`</li>`;
  }
  newya(code,y1);
  $('#plate>li').css({height:`calc( 100% / ${x1})`});
  $('#plate>li>ul>li').css({width:`calc( 100% / ${y1})`});
}
function makearray(row) {// 배열생성
  var array = [];
  for (var i=0;i<row;i++) {
    array[i]= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }
  return array;
}
function newya(c,y) {// css값넣고 생성
  switch (y) {
    case 9:
      $('#wrap').css({width:'360px',height:'360px'});
      break;
    case 16:
      $('#wrap').css({width:'650px',height:'650px'});
      break;
    case 30:
      $('#wrap').css({width:'960px',height:'550px'});
      break;
    default:
  }
  $('#plate').prepend(c);
  $('#wrap').css({
    top: ($(window).height() - $('#wrap').height()) / 2,
    left: ($(window).width() - $('#wrap').width()) / 2
  });
  $('.w').css({
    top: parseInt($('#wrap').css('top'), 10)+$('#wrap').height(),
    left: parseInt($('#wrap').css('left'), 10),
  });
  switch($('.b:first-child>ul>li').length){
    case 9:
      $('.w>span').text(10);
      break;
    case 16:
      $('.w>span').text(40);
      break;
    case 30:
      $('.w>span').text(99);
      break;

  }
}

let first=true;// 처음인지 아닌지
let cx;// 클릭한 x좌표
let cy;// 클릭한 x좌표
let rx;// 우클릭 x
let ry;// 우클릭 y
let over=false;// 끝나면
let over_stack=0;// clear 지뢰표시 스택
let starttime;
let endtime;
$(document).on('click','.c',function (e) {//좌클릭 이벤트
  cy=$(this).index();// 가로
  cx=$(this).parents('.b').index();// 세로
  if(first){//처음
    first=false;//다음클릭부터는 처음이 아님
    mine(cx,cy);//지뢰 생성
    starttime=new Date().getTime();
  }else{

  }
  if(right==0||!right[cx][cy]){//클릭한곳에 지뢰표시가 안돼있으면
    already[cx][cy]=1;
    $(this).css({background:'gray'});
    click(cx,cy,$(this));//클릭\
  }
});
let left=false;
$(document).on('mousedown','.c',function (e) {
  ry=$(this).index();// 가로
  rx=$(this).parents('.b').index();// 세로
  if(e.button==0){
    left=true;
  }
  if(e.button==2){
    if(left&&right[rx][ry]!=1){
      for(var i=0;i<x;i++){
        console.log(i);
        if(already[i].indexOf(1)!= -1){
          no(rx,ry);
          return false;
        }
      }
    }else{
      if(!already[rx][ry]){
        if(!right[rx][ry]){
          right[rx][ry]=1;
          this.style.border='2px solid #000';
          this.style.background='rgb(10, 39, 69)';
        }else{
          right[rx][ry]=0;
          this.style.border='1px solid #fff';
          this.style.background='rgb(45, 136, 231)';
        }
      }
    }
  }
}).on('mouseup','.c',function (e) {
  var mine_stack=mine_length;
  for (var i = 0; i < x; i++) {
    for (var j = 0; j < y; j++){
      if(right!=0&&right[i][j]===1){
        mine_stack--;
        over_stack++;
      }else if(already[i][j]===1){
        over_stack++;
      }
    }
  }
  $('.w>span').text(mine_stack);
  if(over_stack==x*y){
    endtime= new Date().getTime();
    $('body').prepend(`${(endtime - starttime)/1000}초. 클리어`);
  }else{
    over_stack=0;
  }
  if(e.button==0)left=false;
});
function click(clx,cly,cli) {
  switch (len[clx][cly]) {
    case false:
      break;
    case 0:
      len[cx][cy]=false;
      no(clx,cly);
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
      cli.css({background:'black'});
      if(!over){
        endtime= new Date().getTime();
        $('body').prepend(`${(endtime - starttime)/1000}초. 까비`);
        over=true;
        right=0;
        $('body').prepend(`<div id='stop'></div>`);
        $('.c').click();
      }
      break;
    default:

      break;
  }
}
function no(nx,ny) {
  for(var i= -1;i<=1;i++){
    for(var j= -1;j<=1;j++){
      if(nx+i>=0&&nx+i<x){
        if(ny+j>=0&&ny+j<y){
          if(i!=0||j!=0){
            $('#plate>li').eq(nx+i).find('li').eq(ny+j).click();
          }
        }
      }
    }
  }
}

let mine_length;// 지뢰개수
let mx;
let my;
function mine(n, n2) { //x, y
  switch (y) {
    case 9:
      mine_length=10;
      break;
    case 16:
      mine_length=40;
      break;
    case 30:
      mine_length=99;
      break;
    default:
  }
  for (i = 0; i < mine_length; i++) { //지뢰개수만큼 for문을 돌림
    makemine(n,n2,i);
  }
}
function makemine(mmx, mmy,i) {
  mx = Math.floor(Math.random() * (x)); //랜덤좌표
  my = Math.floor(Math.random() * (y)); //랜덤좌표
  if(where(mx,my,mmx,mmy)){
    makemine(mmx,mmy);
  }else{
    if(len[mx][my]===true){
      makemine(mmx, mmy);
    }else{
      // 지금만확인
      // $('#plate>li').eq(mx).find('li').eq(my).css({background:'#000'});
      // 지금만확인
      return len[mx][my]=true,number(mx,my);
    }
  }
}
function where(wx,wy,cwx,cwy) {
  switch (cwx-wx) {
    case -1:
    case 0:
    case 1:
      switch (cwy-wy) {
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
function number(nx,ny) {//8,7
  for(var q= -1;q<= 1;q++){
    for(var w= -1;w<= 1;w++){
      if(nx-q>=0&&nx-q<x){
        if(ny-w>=0&&ny-w<y){
          if(len[nx-q][ny-w]!==true){//len[7][6]len[7][7]len[7][8]
            len[nx-q][ny-w]++;
            // 지금만 확인
            // $('#plate>li').eq(nx-q).find('li').eq(ny-w).text(len[nx-q][ny-w]);
            // 지금만 확인
          }
        }
      }else{
      }
    }
  }
}
