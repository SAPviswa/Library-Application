namespace my.bookshop; 

using {cuid} from '@sap/cds/common';
entity Books : cuid { 

  ISBN         : String;
  title        : String;
  quantity     : Integer;
  author       : String;
  genre        : String;
  language     : String;
  availability : Integer;
  user:Association to Users;
  activeLoans  : Composition of many ActiveLoans
                   on activeLoans.book = $self;

}
@assert.unique:{
userName: [userName],

}
entity Users : cuid {
  userName    : String;
  password    : String;
  email       : String;
  phoneNumber : Integer64;
  Address     : String;
  userType    : String;
  book:Association to many Books on book.user=$self;
  activeLoans : Association to many ActiveLoans
                  on activeLoans.user = $self;
  issueBooks:Association to many IssueBooks on issueBooks.user=$self;


}
entity ActiveLoans : cuid {
  book      : Association to Books;
  user      : Association to Users;
  issueDate : Date;
  dueDate   : Date;
  notify:String
}

entity IssueBooks:cuid{
  book:Association to Books;
  user:Association to Users;
  reservedDate:Date;
}
