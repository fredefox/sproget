export const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { setValue: (value: string) => void },
): React.ReactElement => {
  const { value, setValue, ...rest } = props;
  return (
    <input {...rest} value={value} onChange={(e) => setValue(e.target.value)} />
  );
};
