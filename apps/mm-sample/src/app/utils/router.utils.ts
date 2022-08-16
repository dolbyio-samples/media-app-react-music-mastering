// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQuery() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams;
}
