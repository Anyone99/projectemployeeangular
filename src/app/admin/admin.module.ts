import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule} from '@angular/material';
import { AdminRoutingModule } from "./admin-routing.module";
import { LayoutComponent } from "./layout.component";
import { ListComponent } from "./list.component";
import { AddEditComponent } from "./add-edit.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, AdminRoutingModule],
  declarations: [LayoutComponent, ListComponent, AddEditComponent]
})
export class AdminModule {}
