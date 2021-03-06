import { IAccessor } from './observation';
import { INode, DOM } from '../dom';

export class ClassObserver implements IAccessor {
  doNotCache = true;
  value = '';
  version = 0;
  nameIndex: any;

  constructor(private node: INode) { }

  getValue() {
    return this.value;
  }

  setValue(newValue: any) {
    const addClass = DOM.addClass;
    const removeClass = DOM.removeClass;

    let nameIndex = this.nameIndex || {};
    let version = this.version;
    let names;
    let name;

    // Add the classes, tracking the version at which they were added.
    if (newValue !== null && newValue !== undefined && newValue.length) {
      names = newValue.split(/\s+/);
      for (let i = 0, length = names.length; i < length; i++) {
        name = names[i];

        if (name === '') {
          continue;
        }

        nameIndex[name] = version;
        addClass(this.node, name);
      }
    }

    // Update state variables.
    this.value = newValue;
    this.nameIndex = nameIndex;
    this.version += 1;

    // First call to setValue?  We're done.
    if (version === 0) {
      return;
    }

    // Remove classes from previous version.
    version -= 1;
    
    for (name in nameIndex) {
      if (!nameIndex.hasOwnProperty(name) || nameIndex[name] !== version) {
        continue;
      }

      removeClass(this.node, name);
    }
  }

  subscribe() {
    throw new Error(`Observation of a "${DOM.normalizedTagName(this.node)}" element\'s "class" property is not supported.`);
  }
}
