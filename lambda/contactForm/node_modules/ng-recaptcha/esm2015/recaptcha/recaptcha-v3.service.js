import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, NgZone, Optional, PLATFORM_ID, } from "@angular/core";
import { Subject } from "rxjs";
import { loadScript } from "./load-script";
import { RECAPTCHA_BASE_URL, RECAPTCHA_LANGUAGE, RECAPTCHA_NONCE, RECAPTCHA_V3_SITE_KEY, } from "./tokens";
/**
 * The main service for working with reCAPTCHA v3 APIs.
 *
 * Use the `execute` method for executing a single action, and
 * `onExecute` observable for listening to all actions at once.
 */
export class ReCaptchaV3Service {
    constructor(zone, siteKey, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    platformId, baseUrl, nonce, language) {
        /** @internal */
        this.onLoadComplete = (grecaptcha) => {
            this.grecaptcha = grecaptcha;
            if (this.actionBacklog && this.actionBacklog.length > 0) {
                this.actionBacklog.forEach(([action, subject]) => this.executeActionWithSubject(action, subject));
                this.actionBacklog = undefined;
            }
        };
        this.zone = zone;
        this.isBrowser = isPlatformBrowser(platformId);
        this.siteKey = siteKey;
        this.nonce = nonce;
        this.language = language;
        this.baseUrl = baseUrl;
        this.init();
    }
    get onExecute() {
        if (!this.onExecuteSubject) {
            this.onExecuteSubject = new Subject();
            this.onExecuteObservable = this.onExecuteSubject.asObservable();
        }
        return this.onExecuteObservable;
    }
    get onExecuteError() {
        if (!this.onExecuteErrorSubject) {
            this.onExecuteErrorSubject = new Subject();
            this.onExecuteErrorObservable = this.onExecuteErrorSubject.asObservable();
        }
        return this.onExecuteErrorObservable;
    }
    /**
     * Executes the provided `action` with reCAPTCHA v3 API.
     * Use the emitted token value for verification purposes on the backend.
     *
     * For more information about reCAPTCHA v3 actions and tokens refer to the official documentation at
     * https://developers.google.com/recaptcha/docs/v3.
     *
     * @param {string} action the action to execute
     * @returns {Observable<string>} an `Observable` that will emit the reCAPTCHA v3 string `token` value whenever ready.
     * The returned `Observable` completes immediately after emitting a value.
     */
    execute(action) {
        const subject = new Subject();
        if (this.isBrowser) {
            if (!this.grecaptcha) {
                // todo: add to array of later executions
                if (!this.actionBacklog) {
                    this.actionBacklog = [];
                }
                this.actionBacklog.push([action, subject]);
            }
            else {
                this.executeActionWithSubject(action, subject);
            }
        }
        return subject.asObservable();
    }
    /** @internal */
    executeActionWithSubject(action, subject) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onError = (error) => {
            this.zone.run(() => {
                subject.error(error);
                if (this.onExecuteErrorSubject) {
                    // We don't know any better at this point, unfortunately, so have to resort to `any`
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    this.onExecuteErrorSubject.next({ action, error });
                }
            });
        };
        this.zone.runOutsideAngular(() => {
            try {
                this.grecaptcha
                    .execute(this.siteKey, { action })
                    .then((token) => {
                    this.zone.run(() => {
                        subject.next(token);
                        subject.complete();
                        if (this.onExecuteSubject) {
                            this.onExecuteSubject.next({ action, token });
                        }
                    });
                }, onError);
            }
            catch (e) {
                onError(e);
            }
        });
    }
    /** @internal */
    init() {
        if (this.isBrowser) {
            if ("grecaptcha" in window) {
                this.grecaptcha = grecaptcha;
            }
            else {
                const langParam = this.language ? "&hl=" + this.language : "";
                loadScript(this.siteKey, this.onLoadComplete, langParam, this.baseUrl, this.nonce);
            }
        }
    }
}
ReCaptchaV3Service.decorators = [
    { type: Injectable }
];
ReCaptchaV3Service.ctorParameters = () => [
    { type: NgZone },
    { type: String, decorators: [{ type: Inject, args: [RECAPTCHA_V3_SITE_KEY,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_BASE_URL,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_NONCE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_LANGUAGE,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLXYzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsicmVjYXB0Y2hhL3JlY2FwdGNoYS12My5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixlQUFlLEVBQ2YscUJBQXFCLEdBQ3RCLE1BQU0sVUFBVSxDQUFDO0FBMkJsQjs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUEyQjdCLFlBQ0UsSUFBWSxFQUNtQixPQUFlO0lBQzlDLHdEQUF3RDtJQUNuQyxVQUFrQixFQUNDLE9BQWdCLEVBQ25CLEtBQWMsRUFDWCxRQUFpQjtRQWlIM0QsZ0JBQWdCO1FBQ1IsbUJBQWMsR0FBRyxDQUFDLFVBQWlDLEVBQUUsRUFBRTtZQUM3RCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2RCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FDL0MsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FDL0MsQ0FBQztnQkFDRixJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQzthQUNoQztRQUNILENBQUMs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Q0FBQzt3QkFDbkIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7NEJBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzt5QkFDL0M7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNSLElBQUk7UUFDVixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO2dCQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzthQUM5QjtpQkFBTTtnQkFDTCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM5RCxVQUFVLENBQ1IsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsY0FBYyxFQUNuQixTQUFTLEVBQ1QsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsS0FBSyxDQUNYLENBQUM7YUFDSDtTQUNGO0lBQ0gsQ0FBQzs7O1lBbEpGLFVBQVU7OztZQTdDVCxNQUFNO3lDQTJFSCxNQUFNLFNBQUMscUJBQXFCO1lBRUksTUFBTSx1QkFBdEMsTUFBTSxTQUFDLFdBQVc7eUNBQ2xCLFFBQVEsWUFBSSxNQUFNLFNBQUMsa0JBQWtCO3lDQUNyQyxRQUFRLFlBQUksTUFBTSxTQUFDLGVBQWU7eUNBQ2xDLFFBQVEsWUFBSSxNQUFNLFNBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFBMQVRGT1JNX0lELFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XG5cbmltcG9ydCB7IGxvYWRTY3JpcHQgfSBmcm9tIFwiLi9sb2FkLXNjcmlwdFwiO1xuaW1wb3J0IHtcbiAgUkVDQVBUQ0hBX0JBU0VfVVJMLFxuICBSRUNBUFRDSEFfTEFOR1VBR0UsXG4gIFJFQ0FQVENIQV9OT05DRSxcbiAgUkVDQVBUQ0hBX1YzX1NJVEVfS0VZLFxufSBmcm9tIFwiLi90b2tlbnNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBPbkV4ZWN1dGVEYXRhIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdGhhdCBoYXMgYmVlbiBleGVjdXRlZC5cbiAgICovXG4gIGFjdGlvbjogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHRva2VuIHRoYXQgcmVDQVBUQ0hBIHYzIHByb3ZpZGVkIHdoZW4gZXhlY3V0aW5nIHRoZSBhY3Rpb24uXG4gICAqL1xuICB0b2tlbjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRXhlY3V0ZUVycm9yRGF0YSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uIHRoYXQgaGFzIGJlZW4gZXhlY3V0ZWQuXG4gICAqL1xuICBhY3Rpb246IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBlcnJvciB3aGljaCB3YXMgZW5jb3VudGVyZWRcbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGVycm9yOiBhbnk7XG59XG5cbnR5cGUgQWN0aW9uQmFja2xvZ0VudHJ5ID0gW3N0cmluZywgU3ViamVjdDxzdHJpbmc+XTtcblxuLyoqXG4gKiBUaGUgbWFpbiBzZXJ2aWNlIGZvciB3b3JraW5nIHdpdGggcmVDQVBUQ0hBIHYzIEFQSXMuXG4gKlxuICogVXNlIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGZvciBleGVjdXRpbmcgYSBzaW5nbGUgYWN0aW9uLCBhbmRcbiAqIGBvbkV4ZWN1dGVgIG9ic2VydmFibGUgZm9yIGxpc3RlbmluZyB0byBhbGwgYWN0aW9ucyBhdCBvbmNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVDYXB0Y2hhVjNTZXJ2aWNlIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGlzQnJvd3NlcjogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHNpdGVLZXk6IHN0cmluZztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGFjdGlvbkJhY2tsb2c6IEFjdGlvbkJhY2tsb2dFbnRyeVtdIHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgbm9uY2U6IHN0cmluZztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGxhbmd1YWdlPzogc3RyaW5nO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgYmFzZVVybDogc3RyaW5nO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZ3JlY2FwdGNoYTogUmVDYXB0Y2hhVjIuUmVDYXB0Y2hhO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkV4ZWN1dGVTdWJqZWN0OiBTdWJqZWN0PE9uRXhlY3V0ZURhdGE+O1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgb25FeGVjdXRlRXJyb3JTdWJqZWN0OiBTdWJqZWN0PE9uRXhlY3V0ZUVycm9yRGF0YT47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkV4ZWN1dGVPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZURhdGE+O1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgb25FeGVjdXRlRXJyb3JPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZUVycm9yRGF0YT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgem9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUkVDQVBUQ0hBX1YzX1NJVEVfS0VZKSBzaXRlS2V5OiBzdHJpbmcsXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChSRUNBUFRDSEFfQkFTRV9VUkwpIGJhc2VVcmw/OiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChSRUNBUFRDSEFfTk9OQ0UpIG5vbmNlPzogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUkVDQVBUQ0hBX0xBTkdVQUdFKSBsYW5ndWFnZT86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLnpvbmUgPSB6b25lO1xuICAgIHRoaXMuaXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCk7XG4gICAgdGhpcy5zaXRlS2V5ID0gc2l0ZUtleTtcbiAgICB0aGlzLm5vbmNlID0gbm9uY2U7XG4gICAgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgb25FeGVjdXRlKCk6IE9ic2VydmFibGU8T25FeGVjdXRlRGF0YT4ge1xuICAgIGlmICghdGhpcy5vbkV4ZWN1dGVTdWJqZWN0KSB7XG4gICAgICB0aGlzLm9uRXhlY3V0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxPbkV4ZWN1dGVEYXRhPigpO1xuICAgICAgdGhpcy5vbkV4ZWN1dGVPYnNlcnZhYmxlID0gdGhpcy5vbkV4ZWN1dGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9uRXhlY3V0ZU9ic2VydmFibGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IG9uRXhlY3V0ZUVycm9yKCk6IE9ic2VydmFibGU8T25FeGVjdXRlRXJyb3JEYXRhPiB7XG4gICAgaWYgKCF0aGlzLm9uRXhlY3V0ZUVycm9yU3ViamVjdCkge1xuICAgICAgdGhpcy5vbkV4ZWN1dGVFcnJvclN1YmplY3QgPSBuZXcgU3ViamVjdDxPbkV4ZWN1dGVFcnJvckRhdGE+KCk7XG4gICAgICB0aGlzLm9uRXhlY3V0ZUVycm9yT2JzZXJ2YWJsZSA9IHRoaXMub25FeGVjdXRlRXJyb3JTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9uRXhlY3V0ZUVycm9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgYGFjdGlvbmAgd2l0aCByZUNBUFRDSEEgdjMgQVBJLlxuICAgKiBVc2UgdGhlIGVtaXR0ZWQgdG9rZW4gdmFsdWUgZm9yIHZlcmlmaWNhdGlvbiBwdXJwb3NlcyBvbiB0aGUgYmFja2VuZC5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgcmVDQVBUQ0hBIHYzIGFjdGlvbnMgYW5kIHRva2VucyByZWZlciB0byB0aGUgb2ZmaWNpYWwgZG9jdW1lbnRhdGlvbiBhdFxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvZG9jcy92My5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiB0aGUgYWN0aW9uIHRvIGV4ZWN1dGVcbiAgICogQHJldHVybnMge09ic2VydmFibGU8c3RyaW5nPn0gYW4gYE9ic2VydmFibGVgIHRoYXQgd2lsbCBlbWl0IHRoZSByZUNBUFRDSEEgdjMgc3RyaW5nIGB0b2tlbmAgdmFsdWUgd2hlbmV2ZXIgcmVhZHkuXG4gICAqIFRoZSByZXR1cm5lZCBgT2JzZXJ2YWJsZWAgY29tcGxldGVzIGltbWVkaWF0ZWx5IGFmdGVyIGVtaXR0aW5nIGEgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgZXhlY3V0ZShhY3Rpb246IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgY29uc3Qgc3ViamVjdCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICBpZiAodGhpcy5pc0Jyb3dzZXIpIHtcbiAgICAgIGlmICghdGhpcy5ncmVjYXB0Y2hhKSB7XG4gICAgICAgIC8vIHRvZG86IGFkZCB0byBhcnJheSBvZiBsYXRlciBleGVjdXRpb25zXG4gICAgICAgIGlmICghdGhpcy5hY3Rpb25CYWNrbG9nKSB7XG4gICAgICAgICAgdGhpcy5hY3Rpb25CYWNrbG9nID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGlvbkJhY2tsb2cucHVzaChbYWN0aW9uLCBzdWJqZWN0XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4ZWN1dGVBY3Rpb25XaXRoU3ViamVjdChhY3Rpb24sIHN1YmplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGV4ZWN1dGVBY3Rpb25XaXRoU3ViamVjdChcbiAgICBhY3Rpb246IHN0cmluZyxcbiAgICBzdWJqZWN0OiBTdWJqZWN0PHN0cmluZz5cbiAgKTogdm9pZCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBvbkVycm9yID0gKGVycm9yOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzdWJqZWN0LmVycm9yKGVycm9yKTtcbiAgICAgICAgaWYgKHRoaXMub25FeGVjdXRlRXJyb3JTdWJqZWN0KSB7XG4gICAgICAgICAgLy8gV2UgZG9uJ3Qga25vdyBhbnkgYmV0dGVyIGF0IHRoaXMgcG9pbnQsIHVuZm9ydHVuYXRlbHksIHNvIGhhdmUgdG8gcmVzb3J0IHRvIGBhbnlgXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXNzaWdubWVudFxuICAgICAgICAgIHRoaXMub25FeGVjdXRlRXJyb3JTdWJqZWN0Lm5leHQoeyBhY3Rpb24sIGVycm9yIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ3JlY2FwdGNoYVxuICAgICAgICAgIC5leGVjdXRlKHRoaXMuc2l0ZUtleSwgeyBhY3Rpb24gfSlcbiAgICAgICAgICAudGhlbigodG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHN1YmplY3QubmV4dCh0b2tlbik7XG4gICAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMub25FeGVjdXRlU3ViamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FeGVjdXRlU3ViamVjdC5uZXh0KHsgYWN0aW9uLCB0b2tlbiB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgb25FcnJvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5pc0Jyb3dzZXIpIHtcbiAgICAgIGlmIChcImdyZWNhcHRjaGFcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgdGhpcy5ncmVjYXB0Y2hhID0gZ3JlY2FwdGNoYTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGxhbmdQYXJhbSA9IHRoaXMubGFuZ3VhZ2UgPyBcIiZobD1cIiArIHRoaXMubGFuZ3VhZ2UgOiBcIlwiO1xuICAgICAgICBsb2FkU2NyaXB0KFxuICAgICAgICAgIHRoaXMuc2l0ZUtleSxcbiAgICAgICAgICB0aGlzLm9uTG9hZENvbXBsZXRlLFxuICAgICAgICAgIGxhbmdQYXJhbSxcbiAgICAgICAgICB0aGlzLmJhc2VVcmwsXG4gICAgICAgICAgdGhpcy5ub25jZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkxvYWRDb21wbGV0ZSA9IChncmVjYXB0Y2hhOiBSZUNhcHRjaGFWMi5SZUNhcHRjaGEpID0+IHtcbiAgICB0aGlzLmdyZWNhcHRjaGEgPSBncmVjYXB0Y2hhO1xuICAgIGlmICh0aGlzLmFjdGlvbkJhY2tsb2cgJiYgdGhpcy5hY3Rpb25CYWNrbG9nLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuYWN0aW9uQmFja2xvZy5mb3JFYWNoKChbYWN0aW9uLCBzdWJqZWN0XSkgPT5cbiAgICAgICAgdGhpcy5leGVjdXRlQWN0aW9uV2l0aFN1YmplY3QoYWN0aW9uLCBzdWJqZWN0KVxuICAgICAgKTtcbiAgICAgIHRoaXMuYWN0aW9uQmFja2xvZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG59XG4iXX0=