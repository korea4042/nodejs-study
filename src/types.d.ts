import 'express-session';

declare module 'express-session' {
    interface SessionData {
        checkedPost?: [{ id: number }]; // 필요한 속성 추가
    }
}