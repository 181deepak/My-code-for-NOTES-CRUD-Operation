import { Component, OnInit } from '@angular/core';
import { $ } from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BreadcrumbsService } from '../../../helpers/services/core/breadcrumbs.service';
import { CI_B } from '../../../app.constants';
declare var $: any;
import { NotesService } from '../../../helpers/services/user/notes.service';
import { Router } from '@angular/router';
import { Note } from '../../../helpers/services/user/note';
import { AuthService } from '../../../helpers/services/auth/auth.service';
import { map, filter, scan } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LanguageUtilService } from '../../../helpers/services/language-util.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{
  
  notes: Note[] = [];
  newNote: Note = new Note(); 
  editNote: Note = new Note();
  editIndex: number = null;
  sendNote: Note = new Note();
  deleteNote: Note = new Note();
  deleteIndex: number = null;
  isViewNote = true;
  IsForUpdate: boolean = false;
  bdpath: any;
  prevurl: any;
  addDisable = true;
  val: any = '';

  constructor(private noteService: NotesService, public authService: AuthService, private bd: BreadcrumbsService,
    public translate: TranslateService, private langUtil: LanguageUtilService) {
      langUtil.changeLang(localStorage.getItem('DefaultLang'));

    if(localStorage.getItem('currentView') !== undefined) {
      const view = localStorage.getItem('currentView');
        if(view == 'adminView') {
          this.val = CI_B.ROUTERLINKS.ADMIN + '/' + CI_B.ROUTERLINKS.ADMIN_DASHBOARD + '/' + CI_B.ROUTERLINKS.ADMIN_KNOWLEDGE_PACK;
        }
        else if(view == 'userView') {
          this.val = '/' + CI_B.ROUTERLINKS.USER.ROUTE.Home;
        }
    }

    this.prevurl = bd.setPrevUrl(this.val);
    const path = '  Notes';
    this.bdpath = bd.setPath(path);
  }

  ngOnInit() {
    var userId = this.authService.getUserId();
    this.noteService.getAllNotes(userId).subscribe(
      (response: Note[]) => { 
        this.notes = response;
       });
  }  

  newNoteInit() {
    this.newNote.title = null;
    this.newNote.note = null;
  }
  
  viewNote(i) {
    for (var inc = 0; inc < this.notes.length; inc++) {
      if (i == this.notes[inc].id) {
        this.newNote.id = this.notes[inc].id;
        this.newNote.title = this.notes[inc].title;
        this.newNote.note = this.notes[inc].note;
        this.isViewNote = true;
        this.editIndex = inc; 
      }   
    }
  }

  onChangeTitle() {
    if (this.newNote.title.trim().length != 0) {
      this.addDisable = false;
    } else
    {
      this.addDisable = true;
    }
  }

  // // To add new note in array
  onAddNoteClick() {
    $('#addNoteModal').modal('hide');
    var userId = this.authService.getUserId();
    this.sendNote.userId = userId;
    this.noteService.createNote(this.newNote, this.sendNote).subscribe((response) => { 
      var p: Note = new Note();
      p.id = response.id;
      p.note = response.note;
      p.title = response.title;
      this.notes.push(p);

      //Clear New notes Dialog - TextBoxes
      this.newNote.id = null;
      this.newNote.note = null;
      this.newNote.title= null;
    }, (error) => {
    });
  }

  onEditClick() { 
    this.editNote.id = this.notes[this.editIndex].id; 
    this.editNote.note = this.notes[this.editIndex].note;
    this.editNote.title = this.notes[this.editIndex].title;
    var userId = this.authService.getUserId();
    this.editNote.userId = userId;
    this.isViewNote = false;
    this.IsForUpdate = true;
  } 

  onUpdateClick() { 
    $('#showNoteModal').modal('hide');
    this.noteService.updateNote(this.editNote).subscribe((response: Note) => { 
      var p: Note = new Note();
      p.id = response.id;
      p.note = response.note;
      p.title = response.title;
      this.notes[this.editIndex] = p;

      //Clear edit Note Dialog - TextBoxes
      this.editNote.id = null;
      this.editNote.note = null;
      this.editNote.title = null;
      this.isViewNote = true;
      this.IsForUpdate = false;
    },
      (error) => {
      });
  }

  onDeleteClick() {
    $('#showNoteModal').modal('hide');
  }

  onDeleteNoteClick(index: number) {
    $('#deleteNoteModal').modal('hide');
    this.noteService.deleteNote(index).subscribe(() => {
      var userId = this.authService.getUserId();
      this.noteService.getAllNotes(userId).subscribe(
        (response: Note[]) => { 
          this.notes = response;
      });
    });
  }
}
