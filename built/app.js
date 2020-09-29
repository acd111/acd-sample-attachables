"use strict";
/*!
 * Copyright (c) Alan Chao. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mixed_reality_extension_sdk_1 = require("@microsoft/mixed-reality-extension-sdk");
class HelloWorld {
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.attachedBadges = new Map();
        this.assets = new mixed_reality_extension_sdk_1.AssetContainer(context);
        this.context.onStarted(() => this.started());
        this.context.onUserJoined(user => this.userJoined(user));
        this.context.onUserLeft(user => this.userLeft(user));
    }
    started() {
        // spawn button that attaches on click
        const btnMesh = this.assets.createBoxMesh('box', 0.75, 0.1, 0.75);
        const attachBtn = mixed_reality_extension_sdk_1.Actor.Create(this.context, {
            actor: {
                transform: {
                    local: {
                        scale: { x: 1, y: 1, z: 1 },
                        position: { x: 0, y: 0, z: 0 }
                    }
                },
                text: {
                    contents: "Attach Object",
                    anchor: mixed_reality_extension_sdk_1.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.1
                },
                appearance: {
                    meshId: btnMesh.id
                },
                collider: {
                    geometry: { shape: mixed_reality_extension_sdk_1.ColliderType.Auto }
                }
            }
        });
        const removeBtn = mixed_reality_extension_sdk_1.Actor.Create(this.context, {
            actor: {
                transform: {
                    local: {
                        scale: { x: 1, y: 1, z: 1 },
                        position: { x: 0, y: -0.2, z: 0 }
                    }
                },
                text: {
                    contents: "Remove Object",
                    anchor: mixed_reality_extension_sdk_1.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.1
                },
                appearance: {
                    meshId: btnMesh.id
                },
                collider: {
                    geometry: { shape: mixed_reality_extension_sdk_1.ColliderType.Auto }
                }
            }
        });
        attachBtn.setBehavior(mixed_reality_extension_sdk_1.ButtonBehavior).onClick(user => {
            this.attachObject(user.id);
        });
        removeBtn.setBehavior(mixed_reality_extension_sdk_1.ButtonBehavior).onClick(user => {
            this.removeObject(user.id);
        });
    }
    userJoined(user) {
        // enable to attach object on userJoined
        // this.attachObject(user.id);
    }
    userLeft(user) {
        this.removeObject(user.id);
    }
    attachObject(userId) {
        if (!this.attachedBadges.has(userId)) {
            this.attachedBadges.set(userId, mixed_reality_extension_sdk_1.Actor.CreateFromLibrary(this.context, {
                resourceId: "artifact:1541068714210754658",
                actor: {
                    attachment: {
                        attachPoint: "spine-top",
                        userId: userId
                    },
                    transform: {
                        local: {
                            scale: { x: 0.06, y: 0.06, z: 0.06 },
                            position: { x: -0.10, y: -0.09, z: 0.15 },
                            rotation: mixed_reality_extension_sdk_1.Quaternion.FromEulerAngles(-5 * mixed_reality_extension_sdk_1.DegreesToRadians, -10 * mixed_reality_extension_sdk_1.DegreesToRadians, 0)
                        }
                    }
                }
            }));
        }
    }
    removeObject(userId) {
        if (this.attachedBadges.has(userId)) {
            this.attachedBadges.get(userId).destroy();
            this.attachedBadges.delete(userId);
        }
    }
}
exports.default = HelloWorld;
//# sourceMappingURL=app.js.map