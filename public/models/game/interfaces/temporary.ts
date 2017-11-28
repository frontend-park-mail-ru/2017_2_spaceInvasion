interface Temporary {
  destroy(): void;

  cancel(): void;
}

export default Temporary