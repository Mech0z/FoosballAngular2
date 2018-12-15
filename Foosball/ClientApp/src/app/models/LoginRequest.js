"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoginRequest = /** @class */ (function () {
    function LoginRequest(email, password, deviceName) {
        this.email = email;
        this.password = password;
        this.deviceName = deviceName;
        this.rememberMe = true;
    }
    return LoginRequest;
}());
exports.LoginRequest = LoginRequest;
;
var LoginResponse = /** @class */ (function () {
    function LoginResponse() {
    }
    return LoginResponse;
}());
exports.LoginResponse = LoginResponse;
//# sourceMappingURL=LoginRequest.js.map