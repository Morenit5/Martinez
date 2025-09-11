import { Component, EventEmitter, Input, NgModule, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  imports: [CommonModule, NgbNavModule],
  styleUrl: './tabs.component.scss'
})

export class NavDynamicComponent implements OnInit {

  @Output() tabIndex = new EventEmitter<number>();

  @Input() requiredTabId: number; //el parent necesita cambiar al tab q proporcina en este input
  @Input() title: string = ''; // Ej. "Herramientas"
  @Input() tabItems: any[] = [];
  @Input() tabIcons: any[] = [];
  activeTabId = 0;
  tabs = [];

  ngOnInit(): void {
    //console.log(this.tabItems);
    for(let i =0; i<this.tabItems.length; i++)
    {
      let varTab= { title: this.tabItems[i] , key: this.tabItems[i], tabIcon: this.tabIcons[i] };
      this.tabs[i] = varTab;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requiredTabId']) {
     this.activeTabId = this.requiredTabId;
     this.sendMessageToParent();
    }
  }

  sendMessageToParent() 
  {
    this.tabIndex.emit(this.activeTabId);
  }


}