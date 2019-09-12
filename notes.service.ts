import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Note } from './note';
import { CIP } from '../../../api.constants';
import { DataService } from '../core/interceptor.service';
import { setBindingRoot } from '@angular/core/src/render3/state';


@Injectable({
  providedIn: 'root'
})

export class NotesService
{
  constructor(private dataService: DataService)
  {
  }

  getAllNotes(userId) : Observable<Note[]>
  {
    const url = CIP.BASE_URL + CIP.APIS.GET_NOTES + "/" + userId;
    console.log(url);
    return this.dataService.get(url);
  }

  createNote(newNote : Note, sendNote : Note) : Observable<Note>
  {
    const url = CIP.BASE_URL + CIP.APIS.GET_NOTES;
    delete sendNote.id;
    sendNote.note = newNote.note;
    sendNote.title = newNote.title;
    console.log(sendNote.userId);
    console.log(sendNote);
    console.log(url);
    return this.dataService.post(url, sendNote);
  }

  updateNote(existingNote: Note) : Observable<Note>
  {
    const url = CIP.BASE_URL + CIP.APIS.GET_NOTES;
    return this.dataService.put(url, existingNote);
  }


  deleteNote(NoteID: number)
  {
    const url = CIP.BASE_URL + CIP.APIS.GET_NOTES + "/" + NoteID;
    return this.dataService.delete(url); 
    console.log(url);

  }  
}
