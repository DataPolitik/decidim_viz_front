import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from '../config/language.config';

interface Language {
  name: string,
  code: string
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public LANGUAGES_DICT: any = LANGUAGES;

  public languageItems: Language[] = [];
  public currentLanguage!: string;

  public changeLanguage(languageEvent: any){
    this.translate.use(languageEvent.value.code);
  }

  constructor(private translate: TranslateService) {
        translate.onLangChange.subscribe(lang=>{
          this.currentLanguage = lang.lang;
      })
   }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event.lang
    });

    Object.keys(this.LANGUAGES_DICT).forEach(key => {
      let value = this.LANGUAGES_DICT[key];
      this.languageItems.push(
        {
          name: value,
          code: key
        }
      );
    });


  }

}
