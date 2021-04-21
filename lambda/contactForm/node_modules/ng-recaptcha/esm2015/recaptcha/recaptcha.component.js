import { Component, ElementRef, EventEmitter, HostBinding, Inject, Input, NgZone, Optional, Output, } from "@angular/core";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import { RECAPTCHA_SETTINGS } from "./tokens";
let nextId = 0;
export class RecaptchaComponent {
    constructor(elementRef, loader, zone, settings) {
        this.elementRef = elementRef;
        this.loader = loader;
        this.zone = zone;
        this.id = `ngrecaptcha-${nextId++}`;
        this.errorMode = "default";
        this.resolved = new EventEmitter();
        // The rename will happen a bit later
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.error = new EventEmitter();
        if (settings) {
            this.siteKey = settings.siteKey;
            this.theme = settings.theme;
            this.type = settings.type;
            this.size = settings.size;
            this.badge = settings.badge;
        }
    }
    ngAfterViewInit() {
        this.subscription = this.loader.ready.subscribe((grecaptcha) => {
            if (grecaptcha != null && grecaptcha.render instanceof Function) {
                this.grecaptcha = grecaptcha;
                this.renderRecaptcha();
            }
        });
    }
    ngOnDestroy() {
        // reset the captcha to ensure it does not leave anything behind
        // after the component is no longer needed
        this.grecaptchaReset();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * Executes the invisible recaptcha.
     * Does nothing if component's size is not set to "invisible".
     */
    execute() {
        if (this.size !== "invisible") {
            return;
        }
        if (this.widget != null) {
            this.grecaptcha.execute(this.widget);
        }
        else {
            // delay execution of recaptcha until it actually renders
            this.executeRequested = true;
        }
    }
    reset() {
        if (this.widget != null) {
            if (this.grecaptcha.getResponse(this.widget)) {
                // Only emit an event in case if something would actually change.
                // That way we do not trigger "touching" of the control if someone does a "reset"
                // on a non-resolved captcha.
                this.resolved.emit(null);
            }
            this.grecaptchaReset();
        }
    }
    /** @internal */
    expired() {
        this.resolved.emit(null);
    }
    /** @internal */
    errored(args) {
        this.error.emit(args);
    }
    /** @internal */
    captchaResponseCallback(response) {
        this.resolved.emit(response);
    }
    /** @internal */
    grecaptchaReset() {
        if (this.widget != null) {
            this.zone.runOutsideAngular(() => this.grecaptcha.reset(this.widget));
        }
    }
    /** @internal */
    renderRecaptcha() {
        // This `any` can be removed after @types/grecaptcha get updated
        const renderOptions = {
            badge: this.badge,
            callback: (response) => {
                this.zone.run(() => this.captchaResponseCallback(response));
            },
            "expired-callback": () => {
                this.zone.run(() => this.expired());
            },
            sitekey: this.siteKey,
            size: this.size,
            tabindex: this.tabIndex,
            theme: this.theme,
            type: this.type,
        };
        if (this.errorMode === "handled") {
            renderOptions["error-callback"] = (...args) => {
                this.zone.run(() => this.errored(args));
            };
        }
        this.widget = this.grecaptcha.render(this.elementRef.nativeElement, renderOptions);
        if (this.executeRequested === true) {
            this.executeRequested = false;
            this.execute();
        }
    }
}
RecaptchaComponent.decorators = [
    { type: Component, args: [{
                exportAs: "reCaptcha",
                selector: "re-captcha",
                template: ``
            },] }
];
RecaptchaComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: RecaptchaLoaderService },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_SETTINGS,] }] }
];
RecaptchaComponent.propDecorators = {
    id: [{ type: Input }, { type: HostBinding, args: ["attr.id",] }],
    siteKey: [{ type: Input }],
    theme: [{ type: Input }],
    type: [{ type: Input }],
    size: [{ type: Input }],
    tabIndex: [{ type: Input }],
    badge: [{ type: Input }],
    errorMode: [{ type: Input }],
    resolved: [{ type: Output }],
    error: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJyZWNhcHRjaGEvcmVjYXB0Y2hhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFcEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTlDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQWFmLE1BQU0sT0FBTyxrQkFBa0I7SUEyQjdCLFlBQ1UsVUFBc0IsRUFDdEIsTUFBOEIsRUFDOUIsSUFBWSxFQUNvQixRQUE0QjtRQUg1RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQXdCO1FBQzlCLFNBQUksR0FBSixJQUFJLENBQVE7UUEzQmYsT0FBRSxHQUFHLGVBQWUsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQVF0QixjQUFTLEdBQTBCLFNBQVMsQ0FBQztRQUU1QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUN2RCxxQ0FBcUM7UUFDckMsNERBQTREO1FBQzNDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQztRQWlCcEUsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJ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QUVMLE1BQU07b0JBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xuXG5pbXBvcnQgeyBSZWNhcHRjaGFMb2FkZXJTZXJ2aWNlIH0gZnJvbSBcIi4vcmVjYXB0Y2hhLWxvYWRlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFTZXR0aW5ncyB9IGZyb20gXCIuL3JlY2FwdGNoYS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgUkVDQVBUQ0hBX1NFVFRJTkdTIH0gZnJvbSBcIi4vdG9rZW5zXCI7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG5leHBvcnQgdHlwZSBOZXZlclVuZGVmaW5lZDxUPiA9IFQgZXh0ZW5kcyB1bmRlZmluZWQgPyBuZXZlciA6IFQ7XG5cbmV4cG9ydCB0eXBlIFJlY2FwdGNoYUVycm9yUGFyYW1ldGVycyA9IFBhcmFtZXRlcnM8XG4gIE5ldmVyVW5kZWZpbmVkPFJlQ2FwdGNoYVYyLlBhcmFtZXRlcnNbXCJlcnJvci1jYWxsYmFja1wiXT5cbj47XG5cbkBDb21wb25lbnQoe1xuICBleHBvcnRBczogXCJyZUNhcHRjaGFcIixcbiAgc2VsZWN0b3I6IFwicmUtY2FwdGNoYVwiLFxuICB0ZW1wbGF0ZTogYGAsXG59KVxuZXhwb3J0IGNsYXNzIFJlY2FwdGNoYUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIEBIb3N0QmluZGluZyhcImF0dHIuaWRcIilcbiAgcHVibGljIGlkID0gYG5ncmVjYXB0Y2hhLSR7bmV4dElkKyt9YDtcblxuICBASW5wdXQoKSBwdWJsaWMgc2l0ZUtleTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgdGhlbWU6IFJlQ2FwdGNoYVYyLlRoZW1lO1xuICBASW5wdXQoKSBwdWJsaWMgdHlwZTogUmVDYXB0Y2hhVjIuVHlwZTtcbiAgQElucHV0KCkgcHVibGljIHNpemU6IFJlQ2FwdGNoYVYyLlNpemU7XG4gIEBJbnB1dCgpIHB1YmxpYyB0YWJJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBwdWJsaWMgYmFkZ2U6IFJlQ2FwdGNoYVYyLkJhZGdlO1xuICBASW5wdXQoKSBwdWJsaWMgZXJyb3JNb2RlOiBcImhhbmRsZWRcIiB8IFwiZGVmYXVsdFwiID0gXCJkZWZhdWx0XCI7XG5cbiAgQE91dHB1dCgpIHB1YmxpYyByZXNvbHZlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICAvLyBUaGUgcmVuYW1lIHdpbGwgaGFwcGVuIGEgYml0IGxhdGVyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LW5hdGl2ZVxuICBAT3V0cHV0KCkgcHVibGljIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxSZWNhcHRjaGFFcnJvclBhcmFtZXRlcnM+KCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgd2lkZ2V0OiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBncmVjYXB0Y2hhOiBSZUNhcHRjaGFWMi5SZUNhcHRjaGE7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBleGVjdXRlUmVxdWVzdGVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGxvYWRlcjogUmVjYXB0Y2hhTG9hZGVyU2VydmljZSxcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFJFQ0FQVENIQV9TRVRUSU5HUykgc2V0dGluZ3M/OiBSZWNhcHRjaGFTZXR0aW5nc1xuICApIHtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuc2l0ZUtleSA9IHNldHRpbmdzLnNpdGVLZXk7XG4gICAgICB0aGlzLnRoZW1lID0gc2V0dGluZ3MudGhlbWU7XG4gICAgICB0aGlzLnR5cGUgPSBzZXR0aW5ncy50eXBlO1xuICAgICAgdGhpcy5zaXplID0gc2V0dGluZ3Muc2l6ZTtcbiAgICAgIHRoaXMuYmFkZ2UgPSBzZXR0aW5ncy5iYWRnZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkZXIucmVhZHkuc3Vic2NyaWJlKFxuICAgICAgKGdyZWNhcHRjaGE6IFJlQ2FwdGNoYVYyLlJlQ2FwdGNoYSkgPT4ge1xuICAgICAgICBpZiAoZ3JlY2FwdGNoYSAhPSBudWxsICYmIGdyZWNhcHRjaGEucmVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLmdyZWNhcHRjaGEgPSBncmVjYXB0Y2hhO1xuICAgICAgICAgIHRoaXMucmVuZGVyUmVjYXB0Y2hhKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIC8vIHJlc2V0IHRoZSBjYXB0Y2hhIHRvIGVuc3VyZSBpdCBkb2VzIG5vdCBsZWF2ZSBhbnl0aGluZyBiZWhpbmRcbiAgICAvLyBhZnRlciB0aGUgY29tcG9uZW50IGlzIG5vIGxvbmdlciBuZWVkZWRcbiAgICB0aGlzLmdyZWNhcHRjaGFSZXNldCgpO1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIGludmlzaWJsZSByZWNhcHRjaGEuXG4gICAqIERvZXMgbm90aGluZyBpZiBjb21wb25lbnQncyBzaXplIGlzIG5vdCBzZXQgdG8gXCJpbnZpc2libGVcIi5cbiAgICovXG4gIHB1YmxpYyBleGVjdXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNpemUgIT09IFwiaW52aXNpYmxlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy53aWRnZXQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5ncmVjYXB0Y2hhLmV4ZWN1dGUodGhpcy53aWRnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWxheSBleGVjdXRpb24gb2YgcmVjYXB0Y2hhIHVudGlsIGl0IGFjdHVhbGx5IHJlbmRlcnNcbiAgICAgIHRoaXMuZXhlY3V0ZVJlcXVlc3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLndpZGdldCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5ncmVjYXB0Y2hhLmdldFJlc3BvbnNlKHRoaXMud2lkZ2V0KSkge1xuICAgICAgICAvLyBPbmx5IGVtaXQgYW4gZXZlbnQgaW4gY2FzZSBpZiBzb21ldGhpbmcgd291bGQgYWN0dWFsbHkgY2hhbmdlLlxuICAgICAgICAvLyBUaGF0IHdheSB3ZSBkbyBub3QgdHJpZ2dlciBcInRvdWNoaW5nXCIgb2YgdGhlIGNvbnRyb2wgaWYgc29tZW9uZSBkb2VzIGEgXCJyZXNldFwiXG4gICAgICAgIC8vIG9uIGEgbm9uLXJlc29sdmVkIGNhcHRjaGEuXG4gICAgICAgIHRoaXMucmVzb2x2ZWQuZW1pdChudWxsKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ncmVjYXB0Y2hhUmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZXhwaXJlZCgpIHtcbiAgICB0aGlzLnJlc29sdmVkLmVtaXQobnVsbCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZXJyb3JlZChhcmdzOiBSZWNhcHRjaGFFcnJvclBhcmFtZXRlcnMpIHtcbiAgICB0aGlzLmVycm9yLmVtaXQoYXJncyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgY2FwdGNoYVJlc3BvbnNlQ2FsbGJhY2socmVzcG9uc2U6IHN0cmluZykge1xuICAgIHRoaXMucmVzb2x2ZWQuZW1pdChyZXNwb25zZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZ3JlY2FwdGNoYVJlc2V0KCkge1xuICAgIGlmICh0aGlzLndpZGdldCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5ncmVjYXB0Y2hhLnJlc2V0KHRoaXMud2lkZ2V0KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlbmRlclJlY2FwdGNoYSgpIHtcbiAgICAvLyBUaGlzIGBhbnlgIGNhbiBiZSByZW1vdmVkIGFmdGVyIEB0eXBlcy9ncmVjYXB0Y2hhIGdldCB1cGRhdGVkXG4gICAgY29uc3QgcmVuZGVyT3B0aW9uczogUmVDYXB0Y2hhVjIuUGFyYW1ldGVycyA9IHtcbiAgICAgIGJhZGdlOiB0aGlzLmJhZGdlLFxuICAgICAgY2FsbGJhY2s6IChyZXNwb25zZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5jYXB0Y2hhUmVzcG9uc2VDYWxsYmFjayhyZXNwb25zZSkpO1xuICAgICAgfSxcbiAgICAgIFwiZXhwaXJlZC1jYWxsYmFja1wiOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5leHBpcmVkKCkpO1xuICAgICAgfSxcbiAgICAgIHNpdGVrZXk6IHRoaXMuc2l0ZUtleSxcbiAgICAgIHNpemU6IHRoaXMuc2l6ZSxcbiAgICAgIHRhYmluZGV4OiB0aGlzLnRhYkluZGV4LFxuICAgICAgdGhlbWU6IHRoaXMudGhlbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgfTtcblxuICAgIGlmICh0aGlzLmVycm9yTW9kZSA9PT0gXCJoYW5kbGVkXCIpIHtcbiAgICAgIHJlbmRlck9wdGlvbnNbXCJlcnJvci1jYWxsYmFja1wiXSA9ICguLi5hcmdzOiBSZWNhcHRjaGFFcnJvclBhcmFtZXRlcnMpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmVycm9yZWQoYXJncykpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLndpZGdldCA9IHRoaXMuZ3JlY2FwdGNoYS5yZW5kZXIoXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHJlbmRlck9wdGlvbnNcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuZXhlY3V0ZVJlcXVlc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5leGVjdXRlUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmV4ZWN1dGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==