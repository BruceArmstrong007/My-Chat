import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AuthService, ShareService } from '@client/core';
import { BehaviorSubject, filter, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'my-chat-transfer',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,MatCardModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent {
   private readonly destroy$ : any = new Subject();
  private readonly shareService = inject(ShareService);
  private readonly authService = inject(AuthService);
  data$ : BehaviorSubject<any> = this.shareService?.transferData$;
  roomID !:string;
  connection : any;
  file !: File;
  chunks : any[] = [];
  currentChunk = 0;
  totalChunks = null;
  fileData: any;


  get dataValue(){
    return this.data$.value;
  }

  ngOnInit(){
    console.log('transfer component');

    this.shareService.peer.on('connection',(conn:any)=> {
      conn.on('data',async(data:any) =>{
        console.log(data);
        if (data.type === 'init') {
          this.totalChunks = data.totalChunks;
        } else if (data.type === 'chunk') {
          this.chunks[data.chunkNum] = data.chunk;
          if (Object.keys(this.chunks).length === this.totalChunks) {
            // All chunks have been received
             const file = URL.createObjectURL(await new Blob(this.chunks));
            // Do something with the file
            let a = document.createElement('a');
            a.href = file;
            a.download = this.fileData.name +'.'+ this.fileData.type;
            a.click();
            this.reject();
          }
        } else if (data.type === 'progress') {
          this.updateProgress(data.progress);
        }
      });
    })

    this.roomID = this.authService.generateRoomID(this.dataValue?.from,this.dataValue?.to);
    this.file = this.data$.value?.file;
    this.fileData = JSON.parse(this.data$.value?.extra);
    this.data$.pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      if(res?.message === 'accepted'){
        if(this.file){
          // console.log(this.shareService.peer.id ,res?.contactPeerID);

          this.connection = this.shareService.peer.connect(res?.contactPeerID,{reliable:true});

          const fileReader = new FileReader();
          fileReader.onload = async () =>{
            const fileContents = fileReader.result;
            const chunks = this.chunkData(fileContents);
            this.connection.on('open',()=>{
              this.connection.send({
                type: 'init',
                totalChunks: chunks.length
              });
              })
            await this.sendNextChunk(chunks);
          };
          fileReader.readAsArrayBuffer(this.file);
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


chunkData(data:any) {
  const chunkSize = 16384;
  const chunks = [];
  for (let i = 0; i < data.byteLength; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

 sendNextChunk(chunks:any) {

  this.connection.on('open',()=>{
  this.connection.send({
    type : 'chunk',
    chunk: chunks[this.currentChunk],
    chunkNum: this.currentChunk
  });
  this.currentChunk++;
  this.sendProgress(this.currentChunk / chunks.length);
  if (this.currentChunk < chunks.length) {
    setTimeout(() =>{
      this.sendNextChunk(chunks);
    }, 50);
  }
  })
}

 sendProgress(progress:any) {

  this.connection.on('open',()=>{
    this.connection.send({
      type: 'progress',
      progress: progress
    });
  });
  console.log(progress);
}

 updateProgress(progress:any) {
  console.log(progress);
}

}
