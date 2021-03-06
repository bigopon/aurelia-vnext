import { IBindScope } from "../binding/observation";
import { IAttach } from "./lifecycle";
import { IViewOwner } from "./view";
import { ICustomElement } from "./custom-element";
import { DI } from "../../kernel/di";
import { IRenderSlot } from "./render-slot";

export type RenderCallback = (visual: IVisual) => void;

export enum MotionDirection {
  enter = 'enter',
  leave = 'leave'
}

export interface IVisual extends IBindScope, IViewOwner, IAttach { 
  readonly factory: IVisualFactory;

  parent: IRenderSlot;
  onRender: RenderCallback;
  renderState: any;

  animate(direction: MotionDirection): void | Promise<boolean>;
  tryReturnToCache(): boolean;
}

export type VisualWithCentralComponent = IVisual & { component: ICustomElement };

export interface IVisualFactory {
  readonly name: string;
  readonly isCaching: boolean;
  setCacheSize(size: number | '*', doNotOverrideIfAlreadySet: boolean): void;
  create(): IVisual;
}

export const IVisualFactory = DI.createInterface<IVisualFactory>();
