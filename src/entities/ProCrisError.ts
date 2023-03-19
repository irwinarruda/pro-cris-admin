type ProCrisErrorDTO = {
  title: string;
  message: string | string[];
};

export class ProCrisError {
  public title: string;
  public message: string | string[];

  constructor({ title, message }: ProCrisErrorDTO) {
    this.message = message;
    this.title = title;
  }
}
