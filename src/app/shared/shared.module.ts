import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';

@NgModule({
	declarations: [],
	imports: [
		HttpClientModule,
		QuillModule.forRoot()
	],
	exports: [HttpClientModule, QuillModule]
})
export class SharedModule {}
