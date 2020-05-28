import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit,AfterViewInit {

  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;

  drawing = false;

  seletectedColor= "#00000";
  colors=['#00000', '#FF0000','#00FF00', '#0000FF', "#FFFF00"]
  lineWidth = 2;
  constructor(private plt: Platform) { }
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width()+ '';
    this.canvasElement.height = 200;
  }

  ngOnInit() {
  }

  startDrawing(ev) {
    this.drawing=true;
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;    
    this.saveY = ev.touches[0].pageY - canvasPosition.y;

  }

  endDrawing() {
    this.drawing=false;
  }

  moved(ev){
    if (!this.drawing) return;
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    let ctx = this.canvasElement.getContext("2d");

    let currentX = ev.touches[0].pageX - canvasPosition.x;   
    let currentY = ev.touches[0].pageY - canvasPosition.y;
    
    ctx.lineJoin = 'round';
    ctx.strokeStyle= this.seletectedColor;
    ctx.lineWidth= this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX=currentX;
    this.saveY=currentY;
  }

  saveImage(){
    const dataUrl= this.canvasElement.toDataURL();
    console.log('image : ', dataUrl);
  }

  DeleteImage(){
    let ctx = this.canvasElement.getContext("2d");
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
  }
 
}
