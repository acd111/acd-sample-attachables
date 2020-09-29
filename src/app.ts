/*!
 * Copyright (c) Alan Chao. All rights reserved.
 * Licensed under the MIT License.
 */
 
import {
	Actor,
	AssetContainer,
	ButtonBehavior,
	Context,
	Quaternion,
	TextAnchorLocation,
	User,
	Guid,
	DegreesToRadians,
	ColliderType
} from '@microsoft/mixed-reality-extension-sdk';

export default class HelloWorld {
	private assets: AssetContainer;

	// attachedObjects is a Map that stores userIds and the attached object
	private attachedObjects = new Map<Guid, Actor>();

	constructor(private context: Context, private baseUrl: string) {
		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());
		this.context.onUserJoined(user => this.userJoined(user));
		this.context.onUserLeft(user => this.userLeft(user));
	}
	private started(){
		// spawn button to allow attachment on click
		const btnMesh = this.assets.createBoxMesh('box', 0.75, 0.1, 0.75 );
		const attachBtn = Actor.Create(this.context, {
			actor: {
				transform: {
					local: {
						scale: {x: 1, y: 1, z: 1},
						position: { x: 0, y: 0, z: 0 }
					}
				},
				text: {
					contents: "Attach Object",
					anchor: TextAnchorLocation.MiddleCenter,
					color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
					height: 0.1
				},
				appearance: {
					meshId: btnMesh.id
				},
				collider: {
					geometry: { shape: ColliderType.Auto }
				}
			}
		});
		const removeBtn = Actor.Create(this.context, {
			actor: {
				transform: {
					local: {
						scale: {x: 1, y: 1, z: 1},
						position: { x: 0, y: -0.2, z: 0 }
					}
				},
				text: {
					contents: "Remove Object",
					anchor: TextAnchorLocation.MiddleCenter,
					color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
					height: 0.1
				},
				appearance: {
					meshId: btnMesh.id
				},
				collider: {
					geometry: { shape: ColliderType.Auto }
				}
			}
		});
		attachBtn.setBehavior(ButtonBehavior).onClick(user => {
			this.attachObject(user.id);
		});
		removeBtn.setBehavior(ButtonBehavior).onClick(user => {
			this.removeObject(user.id);
		});
	}
	private userJoined(user: User) {
		// uncomment below to attach object on userJoined instead.
		// this.attachObject(user.id);
	}
	private userLeft(user: User) {
		// remove attached object when user leaves, so it isn't orphaned.
		this.removeObject(user.id);
	}
	private attachObject(userId: Guid){
		// if this.attachedObjects doesn't already include userId
		if(!this.attachedObjects.has(userId)) {
			// add userId to map, value set with attached Actor
			// this example is a pin
			this.attachedObjects.set(userId, Actor.CreateFromLibrary(this.context, {
				resourceId: "artifact:1541068714210754658",
				actor: {
					attachment: {
						attachPoint: "spine-top",
						userId: userId
					},
					transform: {
						local: {
							scale: {x: 0.06 , y: 0.06 , z: 0.06 },
							position: {x: -0.10 , y: -0.09 , z: 0.15 },
							rotation: Quaternion.FromEulerAngles(-5 * DegreesToRadians, -10 * DegreesToRadians, 0)
						}
					}
				}
			}));
		}
	}
	private removeObject(userId: Guid) {
		// if user is stored in map
		if (this.attachedObjects.has(userId)) {
			// destroy the attached actor at key
			this.attachedObjects.get(userId).destroy();
			// delete user's key
			this.attachedObjects.delete(userId);
		}
	}
}
