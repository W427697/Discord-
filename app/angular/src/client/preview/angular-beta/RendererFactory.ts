import { PlatformRef } from '@angular/core';
import { AbstractRenderer } from './AbstractRenderer';
import { DocsRenderer } from './DocsRenderer';
import { CanvasRenderer } from './CanvasRenderer';

export class RendererFactory {
  private lastRenderType: 'canvas' | 'docs';

  private rendererMap = new Map<string, AbstractRenderer>();

  public getRendererInstance(storyId: string, targetDOMNode: HTMLElement) {
    // keep only instances of the same type
    if (this.lastRenderType && this.lastRenderType !== getRenderType(targetDOMNode)) {
      this.rendererMap.clear();
    }

    if (!this.rendererMap.has(storyId)) {
      this.rendererMap.set(storyId, this.buildRenderer(storyId, targetDOMNode));
    }

    this.lastRenderType = getRenderType(targetDOMNode);
    return this.rendererMap.get(storyId);
  }

  private buildRenderer(storyId: string, targetDOMNode: HTMLElement) {
    if (getRenderType(targetDOMNode) === 'docs') {
      return new DocsRenderer(storyId, targetDOMNode);
    }
    return new CanvasRenderer(storyId, targetDOMNode);
  }
}

export const getRenderType = (targetDOMNode: HTMLElement): 'canvas' | 'docs' => {
  return targetDOMNode.id === 'root' ? 'canvas' : 'docs';
};
