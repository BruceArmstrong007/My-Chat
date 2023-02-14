import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AuthService, ShareService } from '@client/core';
import { BehaviorSubject, takeUntil, Subject } from 'rxjs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FileSizePipe } from './file-size.pipe';

@Component({
  selector: 'my-chat-transfer',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,MatCardModule,MatProgressBarModule,FileSizePipe],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent {
   private readonly destroy$ : any = new Subject();
  private readonly shareService = inject(ShareService);
  private readonly authService = inject(AuthService);
  data$ : BehaviorSubject<any> = this.shareService?.transferData$;
  progress$ : BehaviorSubject<any> = new BehaviorSubject(0);
  roomID !:string;
  connection : any;
  file !: File;
  fileData: any;
  BYTES_PER_CHUNK = 1200;
  currentChunk : any = 0;
  incomingFileInfo : any;
  incomingFileData : any;
  bytesReceived : any;
  progress : any = 0;
  downloadInProgress = false;
  fileReader = new FileReader();


  get dataValue(){
    return this.data$.value;
  }

  ngOnInit(){
    console.log('transfer component');

    this.shareService.peer.on('connection',(conn:any)=> {
      conn.on('data',async(data:any) =>{
        if( this.downloadInProgress === false ) {
          this.startDownload( data );
        } else {
          this.progressDownload( data );
        }
      });
    })

    this.roomID = this.authService.generateRoomID(this.dataValue?.from,this.dataValue?.to);
    this.file = this.data$.value?.file;
    this.fileData = JSON.parse(this.data$.value?.extra);
    this.data$.pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      if(res?.message === 'accepted'){
        if(this.file){
          this.connection = this.shareService.peer.connect(res?.contactPeerID,{reliable:true});
          this.connection.on('open',()=>{
            this.connection.send(JSON.stringify({
              fileName: this.file.name,
              fileSize: this.file.size
            }));
            this.readNextChunk();
            this.fileReader.onload = ()=> {
                this.connection.send(this.fileReader.result);
                this.currentChunk++;
            if( this.BYTES_PER_CHUNK * this.currentChunk < this.file.size ) {
              this.readNextChunk();
            }else{
            this.progress$.next(((this.currentChunk * this.BYTES_PER_CHUNK / this.file.size) * 100).toFixed(2));
            }
            };
          });
        }
      }
    })

  }

  accept(){
    this.shareService.transfer({
      roomID :  this.roomID,
      from : this.dataValue?.from,
      to : this.dataValue?.to,
      contactPeerID : this.shareService.peer?.id,
      message : "accepted",
      type: "transfer",
      created_at : new Date()
    },"transfer");
  }

  reject(){
    let message = 'rejected';
    if(this.dataValue?.message === 'request'){
      if(this.dataValue.isCaller) message = 'cancelled';
    }else{
      message = 'received';
    }
    this.shareService.transfer({
    roomID :  this.roomID,
    from : this.dataValue?.from,
    to : this.dataValue?.to,
    peerID : this.dataValue?.contactPeerID,
    message : message,
    type: "transfer",
    created_at : new Date()
    },"transfer");
  }


   readNextChunk() {
    this.progress$.next(((this.currentChunk * this.BYTES_PER_CHUNK / this.file.size) * 100).toFixed(2));
    let start = this.BYTES_PER_CHUNK * this.currentChunk;
    let end = Math.min( this.file.size, start + this.BYTES_PER_CHUNK );
    this.fileReader.readAsArrayBuffer( this.file.slice( start, end ) );
}


 startDownload(data : any) {
  this.incomingFileInfo = JSON.parse( data.toString() );
  this.incomingFileData = [];
  this.bytesReceived = 0;
  this.downloadInProgress = true;
 }

 progressDownload(data : any) {
  this.bytesReceived += data.byteLength;
  this.incomingFileData.push( data );
  this.progress$.next(((this.bytesReceived / this.incomingFileInfo.fileSize ) * 100).toFixed(2));
  if(this.bytesReceived === this.incomingFileInfo.fileSize ) {
    this.endDownload();
  }
 }

endDownload() {
  this.downloadInProgress = false;
  let blob = new window.Blob( this.incomingFileData );
  let anchor = document.createElement( 'a' );
  anchor.href = URL.createObjectURL( blob );
  anchor.download = this.fileData.name;
  anchor.click();
  this.reject();
 }

  ngOnDestroy(){
    this.shareService.destroyPeer();
    this.destroy$.next();
    this.destroy$.complete();
  }


  @HostListener('window:unload', ['$event'])
  unloadHandler(event:any) {
    this.shareService.call({
      roomID :  this.roomID,
      from : this.dataValue?.from,
      to : this.dataValue?.to,
      peerID : this.dataValue?.contactPeerID,
      message : 'missed',
      type: "transfer",
      created_at : new Date()
      },"transfer");
  }
}
