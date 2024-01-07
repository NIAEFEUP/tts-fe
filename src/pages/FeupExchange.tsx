import { ComingSoon } from '../components/layout/ComingSoon'
const FeupExchangePage = () => {

  const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

  let output = cartesian([1,2],[10,20],[100,200,300]);

  return (
    <div>
      <h2>All Permutations</h2>
      <ul>
        {output.map((permutation, index) => (
          <li key={index}>{JSON.stringify(permutation)}</li>
        ))}
      </ul>
    </div>
  );
}

export default FeupExchangePage
