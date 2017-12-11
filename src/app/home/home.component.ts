import {Component} from '@angular/core';
import {EntryComponent} from '../entry/entry.component';

@Component({
               selector: 'app-home',
               templateUrl: './home.component.html',
               styleUrls: ['./home.component.css']
           })
export class HomeComponent {
    title = 'Home!';
}
