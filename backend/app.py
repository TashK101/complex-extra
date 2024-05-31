import flask
from flask import Flask, request
from matplotlib import pyplot as plt
import numpy as np
import io
from solver.z_array import ZArray, ZLabeledArray
from solver.equation import Equation
from solver.parser import ExpressionType

app = Flask(__name__)

known_equations: dict[str, Equation] = {}


@app.route("/strokes", methods=['GET', 'POST', 'OPTIONS'])
def main():
    print(f"Got a request: {request}")
    data = request.get_json(force=True)['z']
    try:
        z_array = ZLabeledArray(data)
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
    if eq.expression.type == ExpressionType.NONE:
        return "Bad function string", 400
    print(f'Calculated expression...')
    function = eq.function
    print(f'Got functional function...')
    response = []
    for label, z in z_array.labeled_points:
        x1, y1 = z.get_x(), z.get_y()
        fz = function(x1 + y1*1j)
        print(f'Processed label {label}')
        response.append([label, [[w.real, w.imag] for w in fz]])
    print(f'Processed, sending back')
    return response


if __name__=="__main__":
    app.run(debug=True)