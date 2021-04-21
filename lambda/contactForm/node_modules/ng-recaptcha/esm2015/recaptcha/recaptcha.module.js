import { NgModule } from "@angular/core";
import { RecaptchaCommonModule } from "./recaptcha-common.module";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import { RecaptchaComponent } from "./recaptcha.component";
export class RecaptchaModule {
}
RecaptchaModule.decorators = [
    { type: NgModule, args: [{
                exports: [RecaptchaComponent],
                imports: [RecaptchaCommonModule],
                providers: [RecaptchaLoaderService],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJyZWNhcHRjaGEvcmVjYXB0Y2hhLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBTzNELE1BQU0sT0FBTyxlQUFlOzs7WUFMM0IsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDaEMsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7YUFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IFJlY2FwdGNoYUNvbW1vbk1vZHVsZSB9IGZyb20gXCIuL3JlY2FwdGNoYS1jb21tb24ubW9kdWxlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFMb2FkZXJTZXJ2aWNlIH0gZnJvbSBcIi4vcmVjYXB0Y2hhLWxvYWRlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFDb21wb25lbnQgfSBmcm9tIFwiLi9yZWNhcHRjaGEuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtSZWNhcHRjaGFDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbUmVjYXB0Y2hhQ29tbW9uTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbUmVjYXB0Y2hhTG9hZGVyU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIFJlY2FwdGNoYU1vZHVsZSB7fVxuIl19