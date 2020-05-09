import { NgModule } from "@angular/core";
/**Controlador de form */
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

//import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
//import {BrowserModule} from "@angular/platform-browser";

/**Angular material */
/*import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";

import { HttpClientModule } from "@angular/common/http";*/

import { AdminRoutingModule } from "./admin-routing.module";
import { LayoutComponent } from "./layout.component";
import { ListComponent } from "./list.component";
import { AddEditComponent } from "./add-edit.component";

// search module
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [LayoutComponent, ListComponent, AddEditComponent]
})
export class AdminModule {}
