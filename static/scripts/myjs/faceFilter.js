/**
 * Created by YGG on 2018\11\14 0014.
 */
function faceData(){
    this.dface =''; //处理后的图片
    this.landmarks = []; //人脸标注点
    this.k1 = '';          // 以下六个参数为 脸颊的扇形区域
    this.k2 = '';
    this.x1 = '';
    this.y1 = '';
    this.x2 = '';
    this.y2 = '';
}

var fData = new faceData();

//均值滤波 (图片，滤波器模板大小，范围())
function meanFilter(size, w1,h1,w2,h2){
        //alert(test.data[0])
        //image=context1.getImageData(0,0,img.width,img.height);
        var width  = fData.dface.width;
        var height = fData.dface.height;
        var imgCopy = new Image();
        imgCopy.data =  fData.dface.data.slice(0);
        for (var j=h1;j<h2;j+=1)  //边缘不处理
        {
            for (var i=w1;i<w2;i+=1)
            {
                var sum0 = 0;
                var sum1 = 0;
                var sum2 = 0;
                for ( var m=j-size; m<j+size+1; m+=1)
                {
                    for (var n=i-size; n<i+size+1; n+=1)
                    {
                        var k=4*(width*m+n);
                        sum0 += imgCopy.data [ k + 0] ;
                        sum1 += imgCopy.data [ k + 1] ;
                        sum2 += imgCopy.data [ k + 2] ;
                    }
                }
                sum0 /= (size*2+1)*(size*2+1);
                sum1 /= (size*2+1)*(size*2+1);
                sum2 /= (size*2+1)*(size*2+1);
                fData.dface.data [ 4*(j*width+i)+0 ] = parseInt(sum0);
                fData.dface.data [ 4*(j*width+i)+1 ] = parseInt(sum1);
                fData.dface.data [ 4*(j*width+i)+2 ] = parseInt(sum2);
            }
        }
 }


//判断点是否在两线夹角中间
function inLineAngle( x0,y0 ){
    if (((fData.k1*(x0 - fData.x1) -(y0 - fData.y1))< 0) &&
     (fData.k2*(x0 - fData.x2) -(y0 - fData.y2))<0)
        return 1;
    else
        return 0;
}

//下巴胖瘦(图片，液化的坐标（x，y），液化镜半径，液化强度)
function chinLiquidFilter(PointX,PointY,Radius,chinStrength){
    var im = new Image();
    im.width = fData.dface.width;
    im.height = fData.dface.height;
    im.data = fData.dface.data.slice(0);
    var width  = fData.dface.width;
    var height = fData.dface.height;
    var Left = PointX - Radius;
    if (Left < 0)Left =0;
    var Top = PointY-Radius;
    if (Top < 0)Top  =0;
    var Bottom = PointY + Radius;
    if (Bottom >= im.height)Bottom =im.height-1;
    var Right = PointX + Radius;
    if (Right >= im.width)Right = im.width - 1;

    var PowRadius = Radius * Radius;
    for (Y = Top;Y< Bottom;Y+=1){
        var OffSetY  = Y - PointY;
        for (X = Left;X < Right; X+=1){
            var OffsetX  = X - PointX;
            var XY = OffsetX  * OffsetX  + OffSetY * OffSetY; //距离的平方
            if ((XY <= PowRadius) && (inLineAngle(X,Y) == 1)){
                ScaleFactor = 1 - XY / PowRadius;
                ScaleFactor = 1 - chinStrength / 100 * ScaleFactor; //按照这种关系计算取样点的位置\
                var PosX = parseInt(OffsetX * ScaleFactor + PointX);
                var PosY = parseInt(OffSetY * ScaleFactor + PointY);
                if (PosX < 0) //放置越界
                    PosX = 0;
                else if (PosX >= im.width)
                    PosX = im.width - 1;
                if (PosY < 0 )
                        PosY = 0;
                else if (PosY >= im.height)
                    PosY = im.height - 1;

                fData.dface.data[4*(im.width*Y+X)+0] = im.data[4*(im.width*PosY +PosX)+0 ];
                fData.dface.data[4*(im.width*Y+X)+1] = im.data[4*(im.width*PosY +PosX)+1 ];
                fData.dface.data[4*(im.width*Y+X)+2] = im.data[4*(im.width*PosY +PosX)+2 ];
            }
        }
    }
 }

//圆形滤镜(图片，液化的坐标（x，y），液化镜半径，液化强度)
function RoundLiquidFilter(PointX,PointY,Radius,eyeStrength){
    var im = new Image();
    im.width = fData.dface.width;
    im.height = fData.dface.height;
    im.data = fData.dface.data.slice(0);
    var width  = fData.dface.width;
    var height = fData.dface.height;
    var Left = PointX - Radius;
    if (Left < 0)Left =0;
    var Top = PointY-Radius;
    if (Top < 0)Top  =0;
    var Bottom = PointY + Radius;
    if (Bottom >= height)Bottom =height-1;
    var Right = PointX + Radius;
    if (Right >= width)Right = width - 1;

    var PowRadius = Radius * Radius;
    for (Y = Top;Y< Bottom;Y+=1){
        var OffSetY  = Y - PointY;
        for (X = Left;X < Right; X+=1){
            var OffsetX  = X - PointX;
            var XY = OffsetX  * OffsetX  + OffSetY * OffSetY; //距离的平方
            if ( XY <= PowRadius ) {
                ScaleFactor = 1 - XY / PowRadius;
                ScaleFactor = 1 - eyeStrength / 100 * ScaleFactor; //按照这种关系计算取样点的位置\
                var PosX = parseInt(OffsetX * ScaleFactor + PointX);
                var PosY = parseInt(OffSetY * ScaleFactor + PointY);
                if (PosX < 0) //放置越界
                    PosX = 0;
                else if (PosX >= width)
                    PosX = width - 1;
                if (PosY < 0 )
                        PosY = 0;
                else if (PosY >= height)
                    PosY = height - 1;

                fData.dface.data[4*(width*Y+X)+0] = im.data[4*(width*PosY +PosX)+0 ];
                fData.dface.data[4*(width*Y+X)+1] = im.data[4*(width*PosY +PosX)+1 ];
                fData.dface.data[4*(width*Y+X)+2] = im.data[4*(width*PosY +PosX)+2 ];
            }
        }
    }
 }

//下巴
function chinChange(chinStrength){
        var PointX = 0;
        var PointY = 0;
        var Radius = 0;
        //左边脸
        PointX = (fData.landmarks[4][0] + fData.landmarks[48][0])/2;
        PointY = (fData.landmarks[4][1] + fData.landmarks[48][1])/2;
        Radius = Math.sqrt(
                Math.pow((fData.landmarks[6][0]+fData.landmarks[7][0])/2 -
                (fData.landmarks[4][0] +fData.landmarks[48][0])/2,2 ) +
                 Math.pow((fData.landmarks[6][1]+fData.landmarks[7][1])/2 -
                (fData.landmarks[4][1] +fData.landmarks[48][1])/2,2 )
                );
        //脸颊点到下颚点直线斜率
        fData.k1 = (PointY - fData.landmarks[7][1])/ (PointX - fData.landmarks[7][0]);
        //脸颊点到耳垂点直线斜率
        fData.k2 = (PointY - fData.landmarks[1][1])/ (PointX - fData.landmarks[1][0]);
        fData.x1 = fData.landmarks[7][0];
        fData.y1 = fData.landmarks[7][1];
        fData.x2 = fData.landmarks[1][0];
        fData.y2 = fData.landmarks[1][1];
        chinLiquidFilter(parseInt(PointX),parseInt(PointY),parseInt(Radius),chinStrength );
        //邻域平均滤波
        meanFilter(1,fData.x2,fData.y2,fData.x1,fData.y1);
        //右边脸
        PointX = (fData.landmarks[54][0] + fData.landmarks[12][0])/2;
        PointY = (fData.landmarks[54][1] + fData.landmarks[12][1])/2;
        Radius = Math.sqrt(
                Math.pow((fData.landmarks[54][0] + fData.landmarks[12][0])/2 -
                (fData.landmarks[9][0] + fData.landmarks[10][0])/2,2 ) +
                 Math.pow((fData.landmarks[54][1] + fData.landmarks[12][1])/2 -
                (fData.landmarks[9][1] + fData.landmarks[10][1])/2,2 )
                );
        //脸颊点到下颚点直线斜率
        fData.k1 = (PointY - fData.landmarks[9][1])/ (PointX - fData.landmarks[9][0]);
        //脸颊点到耳垂点直线斜率
        fData.k2 = (PointY - fData.landmarks[15][1])/ (PointX - fData.landmarks[15][0]);

        fData.x1 = fData.landmarks[9][0];
        fData.y1 = fData.landmarks[9][1];
        fData.x2 = fData.landmarks[15][0];
        fData.y2 = fData.landmarks[15][1];

        chinLiquidFilter(parseInt(PointX),parseInt(PointY),parseInt(Radius),chinStrength )
        //邻域平均滤波
        meanFilter(1,fData.x1,fData.y2,fData.x2,fData.y1);
}

//眼睛
function eyeChange(eyeStrength){
    //左眼瞳孔位置
    var leftEye_X  = (fData.landmarks[37][0] + fData.landmarks[38][0] + fData.landmarks[40][0] + fData.landmarks[41][0])/4;
    var leftEye_Y  = (fData.landmarks[37][1] + fData.landmarks[38][1] + fData.landmarks[40][1] + fData.landmarks[41][1])/4;
    //右眼瞳孔位置
    var rightEye_X = (fData.landmarks[43][0] + fData.landmarks[44][0] + fData.landmarks[47][0] + fData.landmarks[46][0])/4;
    var rightEye_Y  = (fData.landmarks[43][1] + fData.landmarks[44][1] + fData.landmarks[47][1] + fData.landmarks[46][1])/4;
    var Radius = rightEye_X - fData.landmarks[22][0];
    RoundLiquidFilter(parseInt(leftEye_X),parseInt(leftEye_Y),parseInt(Radius),eyeStrength);
    RoundLiquidFilter(parseInt(rightEye_X),parseInt(rightEye_Y),parseInt(Radius),eyeStrength);
}

//鼻翼缩放(左边or右边，液化的坐标（x，y），液化镜半径，液化强度)
function noseLiquidFilter(lr,PointX,PointY,Radius,noseStrength){
    var im = new Image();
    im.width = fData.dface.width;
    im.height = fData.dface.height;
    im.data = fData.dface.data.slice(0);
    var width  = fData.dface.width;
    var height = fData.dface.height;
    var Left = PointX - Radius;
    if (Left < 0)Left =0;
    var Top = PointY-Radius;
    if (Top < 0)Top  =0;
    var Bottom = PointY + Radius;
    if (Bottom >= height)Bottom =height-1;
    var Right = PointX + Radius;
    if (Right >= width)Right = width - 1;

    var PowRadius = Radius * Radius;
    for (Y = Top;Y< Bottom;Y+=1){
        var OffSetY  = Y - PointY;
        for (X = Left;X < Right; X+=1){
            var OffsetX  = X - PointX;
            var XY = OffsetX  * OffsetX  + OffSetY * OffSetY; //距离的平方
            if (lr == 0) var lr_t = X < PointX;
            else var lr_t = X> PointX;
                if ( XY <= PowRadius && Y < PointY && lr_t) {
                ScaleFactor = 1 - XY / PowRadius;
                ScaleFactor = 1 - noseStrength / 100 * ScaleFactor; //按照这种关系计算取样点的位置\
                var PosX = parseInt(OffsetX * ScaleFactor + PointX);
                var PosY = parseInt(OffSetY * ScaleFactor + PointY);
                if (PosX < 0) //放置越界
                    PosX = 0;
                else if (PosX >= width)
                    PosX = width - 1;
                if (PosY < 0 )
                        PosY = 0;
                else if (PosY >= height)
                    PosY = height - 1;

                fData.dface.data[4*(width*Y+X)+0] = im.data[4*(width*PosY +PosX)+0 ];
                fData.dface.data[4*(width*Y+X)+1] = im.data[4*(width*PosY +PosX)+1 ];
                fData.dface.data[4*(width*Y+X)+2] = im.data[4*(width*PosY +PosX)+2 ];
            }
        }
    }
}

function noseChange(noseStrength){
    //左鼻翼中心位置
    var leftNose_X  = fData.landmarks[32][0];
    var leftNose_Y  = fData.landmarks[32][1];
    //右眼瞳孔位置
    var rightNose_X = fData.landmarks[34][0];
    var rightNose_Y = fData.landmarks[34][1];
    var Radius = fData.landmarks[35][0] - fData.landmarks[32][0];
    noseLiquidFilter(0,parseInt(leftNose_X),parseInt(leftNose_Y),parseInt(Radius),noseStrength);
    noseLiquidFilter(1,parseInt(rightNose_X),parseInt(rightNose_Y),parseInt(Radius),noseStrength);
}

//鼻窦缩放
function nBeanChange(nBeanStrength){
    var nBean_X = fData.landmarks[30][0];
    var nBean_Y = fData.landmarks[30][1];
    var Radius = fData.landmarks[30][1] - fData.landmarks[29][1];
    RoundLiquidFilter(parseInt(nBean_X),parseInt(nBean_Y),Radius,nBeanStrength);
}

//处理图片
function draw(oFaceDat ,chinStrength,eyeStrength,noseStrength,nBeanStrength, marks){

    fData.landmarks = marks;
    fData.dface = oFaceDat;
    fData.dface.data = oFaceDat.data.slice(0);

    if( Math.abs(chinStrength)>1)chinChange(chinStrength);  //下巴
    if( Math.abs(eyeStrength)>1)eyeChange(eyeStrength);   //眼睛
    if( Math.abs(noseStrength)>1)noseChange(noseStrength); //鼻孔
    if( Math.abs(nBeanStrength)>1)nBeanChange(nBeanStrength); //鼻窦

    return fData.dface;
}

