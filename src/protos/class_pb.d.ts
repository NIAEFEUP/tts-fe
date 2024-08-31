// package: example
// file: class.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Class extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getCourseUnitId(): number;
  setCourseUnitId(value: number): void;

  hasLastUpdated(): boolean;
  clearLastUpdated(): void;
  getLastUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastUpdated(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Class.AsObject;
  static toObject(includeInstance: boolean, msg: Class): Class.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Class, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Class;
  static deserializeBinaryFromReader(message: Class, reader: jspb.BinaryReader): Class;
}

export namespace Class {
  export type AsObject = {
    id: number,
    name: string,
    courseUnitId: number,
    lastUpdated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

