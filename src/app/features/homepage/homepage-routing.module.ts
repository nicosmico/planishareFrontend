import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResultsComponent } from './results/results.component';
import { TopsComponent } from './tops/tops.component';

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
        // redirectTo: 'results',
        // pathMatch: 'full'
    },
    {
        path: 'results',
        component: ResultsComponent
    },
    {
        path: 'tops',
        component: TopsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomepageRoutingModule { }
