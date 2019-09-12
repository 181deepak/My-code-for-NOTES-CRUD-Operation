export class Note 
{
  id: number;
  title: string;
  note: string;
  userId?: string;

  constructor()
  {
      this.id = 0;
      this.title = null;
      this.note = null;
  }
}
