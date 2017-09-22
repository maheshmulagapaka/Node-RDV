import { Component } from '@angular/core';

@Component({
    selector : 'app-root',
    template : `<nav>
          <button  routerLink="/communicate">Communicate</button >
          <button  routerLink="/list-view/12345">List View</button >
      </nav>
     <router-outlet></router-outlet>
    `
})
export class LandingPageComponent{
}