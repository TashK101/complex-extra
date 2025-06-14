from flask import Flask, request
from solver.z_array import ZArray, ZLabeledArray
from solver.equation import Equation
from solver.parser import ExpressionType, ParserError
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, origins=['http://localhost:5000', 'https://complex-variable.netlify.app'])

known_equations: dict[str, Equation] = {} 

def ensure_flat_list(val):
    # If val is a list of complex numbers, return as is
    if isinstance(val, list):
        # Check if nested list, flatten once
        if val and isinstance(val[0], list):
            return [item for sublist in val for item in sublist]
        else:
            return val
    else:
        # Single complex number -> wrap in list
        return [val]

@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"

@app.route("/strokes", methods=['GET', 'POST', 'OPTIONS'])
def main():
    print(f"Got a request: {request}")
    raw_data = request.get_json(force=True)
    z_data = raw_data['z']
    ln_branches = raw_data.get('lnBranches', 6)
    try:
        z_array = ZLabeledArray(z_data)
        f = request.args.get('f')
    except TypeError:
        print(f'Bad request')
        return "Bad request", 400
    if f is None:
        return 200
    print(f'Function: {f}')
    if f not in known_equations.keys():
        known_equations[f] = Equation(f)
    eq = known_equations[f]
    try:
        if eq.expression.type == ExpressionType.NONE:
            return "Bad function string", 400
        print(f'Calculated expression...')
        function = eq.function
        print(f'Got functional function...')
        response = []
    except ParserError as e:
        return f'{e.type.value} {e.text_value}', 400
    response = []
    for label, z in z_array.labeled_points:
        x1, y1 = z.get_x(), z.get_y()
        fz = function(x1 + y1*1j, num_branches=ln_branches)
        fz = ensure_flat_list(fz)
        response.append([label, [[w.real, w.imag] for w in fz]])
    print(f'Processed, sending back')
    return response


if __name__=="__main__":
    app.run(debug=True)