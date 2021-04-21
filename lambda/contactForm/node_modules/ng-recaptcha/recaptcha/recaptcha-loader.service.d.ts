/// <reference types="grecaptcha" />
import { Observable } from "rxjs";
export declare class RecaptchaLoaderService {
    private readonly platformId;
    /**
     * @internal
     * @nocollapse
     */
    private static ready;
    ready: Observable<ReCaptchaV2.ReCaptcha>;
    /** @internal */
    private language;
    /** @internal */
    private baseUrl;
    /** @internal */
    private nonce;
    /** @internal */
    private v3SiteKey;
    constructor(platformId: Object, language?: string, baseUrl?: string, nonce?: string, v3SiteKey?: string);
    /** @internal */
    private init;
}
