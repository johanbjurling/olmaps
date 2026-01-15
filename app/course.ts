class Course {
  public readonly id: string;
  public readonly pointIds: readonly string[];

  constructor({ id, pointIds }: { id?: string; pointIds: readonly string[] }) {
    this.id = id ?? crypto.randomUUID();
    this.pointIds = Object.freeze([...pointIds]);

    Object.freeze(this);
  }

  public copy({ pointIds }: { pointIds?: readonly string[] }): Course {
    return new Course({ id: this.id, pointIds: pointIds ?? this.pointIds });
  }

  public toJSON() {
    return {
      id: this.id,
      pointIds: this.pointIds,
    };
  }
}

export default Course;
