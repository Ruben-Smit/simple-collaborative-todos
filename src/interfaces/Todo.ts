export class Todo {
  public readonly id: string;
  public readonly parent?: Todo;
  public children: Todo[] = [];
  public status: 'unchecked' | 'checked' = 'unchecked';
  public title: string = '';
  public tags: string[] = [];
  private _publishId?: string;

  get publishId(): string {
    return this._publishId;
  }

  set publishId(value: string) {
    this._publishId = value;
    this.children.forEach((child) => (child.publishId = value));
  }

  get isInstance(): boolean {
    return this instanceof Todo && (!this.parent || this.parent.isInstance);
  }

  private static getApicalParent(todo: Record<string, any>): Todo | Record<string, any> {
    let { parent } = todo;
    while (parent?.parent) {
      parent = parent.parent;
    }
    return parent ?? todo;
  }

  public getApicalParent(): Todo | Record<string, any> {
    return Todo.getApicalParent(this);
  }

  constructor(title?: string, parent?: Todo) {
    this.title = (title ?? this.title)?.trim();
    this.parent = parent;
    this.id = crypto.randomUUID();
  }

  clone(): Todo {
    return Object.assign(new Todo(), this);
  }

  public findDescendantById(id: string): Todo {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findDescendantById(id);
      if (found) return found;
    }
    return undefined;
  }

  public static fromObject(object: Record<string, any>): Todo {
    const apicalIntance = Object.assign(new Todo(), Todo.getApicalParent(object));
    apicalIntance.tags = Array.isArray(apicalIntance.tags) ? [...apicalIntance.tags] : [];
    apicalIntance.children = Todo.convertChildrenToInstances(apicalIntance.children, apicalIntance);
    return apicalIntance.findDescendantById(object.id);
  }

  private static convertChildrenToInstances(children: Record<string, any>[], parent: Todo): Todo[] {
    return children.map((child) => {
      const childInstance = Object.assign(new Todo(), {
        ...child,
        parent,
      });
      childInstance.tags = Array.isArray(child.tags) ? [...child.tags] : [];
      childInstance.children = Todo.convertChildrenToInstances(child.children ?? [], childInstance);
      return childInstance;
    });
  }
}
