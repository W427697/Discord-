import { Component, Directive, Pipe, Input, Output, NgModule } from '@angular/core';
import { isDecoratorInstanceOf } from './isDecoratorInstanceOf';

// Simulate Angular's behavior by manually adding the ngMetadataName property, since this information is added during compile time.
const MockComponentDecorator = { ...Component, ngMetadataName: 'Component' };
const MockDirectiveDecorator = { ...Directive, ngMetadataName: 'Directive' };
const MockPipeDecorator = { ...Pipe, ngMetadataName: 'Pipe' };
const MockInputDecorator = { ...Input, ngMetadataName: 'Input' };
const MockOutputDecorator = { ...Output, ngMetadataName: 'Output' };
const MockNgModuleDecorator = { ...NgModule, ngMetadataName: 'NgModule' };

describe('isDecoratorInstanceOf', () => {
  it('should correctly identify a Component', () => {
    expect(isDecoratorInstanceOf(MockComponentDecorator, 'Component')).toBe(true);
  });

  it('should correctly identify a Directive', () => {
    expect(isDecoratorInstanceOf(MockDirectiveDecorator, 'Directive')).toBe(true);
  });

  it('should correctly identify a Pipe', () => {
    expect(isDecoratorInstanceOf(MockPipeDecorator, 'Pipe')).toBe(true);
  });

  it('should correctly identify an Input', () => {
    expect(isDecoratorInstanceOf(MockInputDecorator, 'Input')).toBe(true);
  });

  it('should correctly identify an Output', () => {
    expect(isDecoratorInstanceOf(MockOutputDecorator, 'Output')).toBe(true);
  });

  it('should correctly identify an NgModule', () => {
    expect(isDecoratorInstanceOf(MockNgModuleDecorator, 'NgModule')).toBe(true);
  });

  it('should return false for mismatched metadata names', () => {
    expect(isDecoratorInstanceOf(MockComponentDecorator, 'Directive')).toBe(false);
  });

  it('should handle null or undefined decorators gracefully', () => {
    expect(isDecoratorInstanceOf(null, 'Component')).toBe(false);
    expect(isDecoratorInstanceOf(undefined, 'Component')).toBe(false);
  });

  it('should handle decorators without ngMetadataName property', () => {
    const mockDecoratorWithoutMetadata = {};
    expect(isDecoratorInstanceOf(mockDecoratorWithoutMetadata, 'Component')).toBe(false);
  });
});
