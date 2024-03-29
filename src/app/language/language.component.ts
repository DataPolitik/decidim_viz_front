import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LANGUAGES } from '../config/language.config';

interface Language {
  name: string,
  code: string
}

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {
  private languageSubscription: Subscription | undefined;
  private isLanguageReceived: boolean = false;

  public LANGUAGES_DICT: any = LANGUAGES;

  public languageItems: Language[] = [];
  public currentLanguage!: string;

  public changeLanguage(languageEvent: any){
    this.translate.use(languageEvent.value.code);
    this.translate.use(languageEvent.value.code);
  }


  constructor(private translate: TranslateService) {
    this.languageSubscription = translate.onLangChange.subscribe(lang=>{
      if(!this.isLanguageReceived){
        this.currentLanguage = lang.lang;
        this.isLanguageReceived = true;
      }
    });
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

}
