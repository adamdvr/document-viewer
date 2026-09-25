export interface DocumentPage {
  readonly number: number;
  readonly imageUrl: string;
}

export interface DocumentInfo {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly DocumentPage[];
}
