using my.bookshop as my from '../db/data-model';
@path: '/BooksSrv'
service CatalogService {
     entity Books as projection on my.Books;
     entity Users as projection on my.Users;
     entity ActiveLoans as projection on my.ActiveLoans
     entity IssueBooks as projection on my.IssueBooks;
}