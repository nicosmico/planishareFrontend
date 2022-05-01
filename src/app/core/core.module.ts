import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from './services/sidenav.service';
import { PostsService } from './services/posts.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        SidenavService,
        PostsService
    ]
})
export class CoreModule { }
