interface SpinnerProps {
  size?: 'sm' | 'md'
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const dim = size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
  return (
    <div className={`${dim} rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin`} />
  )
}
