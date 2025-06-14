import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './AboutSection.css';
import { useState } from 'react';

const Collapsible = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`arrow ${open ? 'open' : ''}`}>&#9662;</span>
      </div>
      {open && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

const AboutSection = () => {
  return (
    <section className="about-details section-padding">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6" data-aos="fade-right">
            <div className="single_about_details ">
              <h3>Графический калькулятор для практических занятий по ТФКП</h3>

              <Collapsible title="Введение в дисциплину ТФКП">
                <p>
                  Теория функций комплексного переменного (ТФКП) — это раздел анализа, изучающий функции, аргументом которых является комплексное число.
                  Пример: <InlineMath math="z = x + iy" />, где <InlineMath math="x, y \in \mathbb{R}" />.
                </p>
                <BlockMath math="i^2 = -1" />
                <p>
                  Пример уравнения, не имеющего решения в <InlineMath math="\mathbb{R}" />: <InlineMath math="x^2 + 1 = 0" />.
                  В комплексной области это уравнение имеет два решения: <InlineMath math="x = \pm i" />.
                </p>
              </Collapsible>

              <Collapsible title="О приложении">
                <p>
                  Приложение предназначено для интерактивной работы с функциями комплексного переменного:
                </p>
                <ul>
                  <li>Отображение функций комплексного переменного</li>
                  <li>Поддержка многозначных функций</li>
                  <li>Работа с гиперболическими функциями</li>
                  <li>Поддержка комплексных логарифмов и корней</li>
                </ul>
              </Collapsible>

              <Collapsible title="Поддерживаемые функции и операторы">
                <p><strong>Числовые и специальные константы:</strong></p>
                <ul>
                  <li><InlineMath math="i" /> — мнимая единица</li>
                  <li><InlineMath math="\pi" />, <InlineMath math="e" /> — известные математические константы</li>
                </ul>

                <p><strong>Унарные функции:</strong></p>
                <ul>
                  <li><InlineMath math="\operatorname{Re}(z)" /> — действительная часть</li>
                  <li><InlineMath math="\operatorname{Im}(z)" /> — мнимая часть</li>
                  <li><InlineMath math="\sin(z), \cos(z), \tan(z)" /> — тригонометрические</li>
                  <li><InlineMath math="\sinh(z), \cosh(z), \tanh(z)" /> — гиперболические</li>
                  <li><InlineMath math="\operatorname{abs}(z)" /> — модуль</li>
                  <li><InlineMath math="\phi(z)" /> — аргумент (фаза)</li>
                </ul>

                <p><strong>Бинарные операции:</strong></p>
                <ul>
                  <li><InlineMath math="f(z) + g(z)" /> — сложение</li>
                  <li><InlineMath math="f(z) - g(z)" /> — вычитание</li>
                  <li><InlineMath math="f(z) \cdot g(z)" /> — умножение</li>
                  <li><InlineMath math="\frac{f(z)}{g(z)}" /> — деление</li>
                  <li><InlineMath math="f(z)^{g(z)}" /> — возведение в степень</li>
                </ul>

                <p><strong>Многозначные функции:</strong></p>
                <ul>
                  <li><InlineMath math="\log_{b}(z)" /> — комплексный логарифм, возвращающий ветви:</li>
                  <BlockMath math="\log_b(z) = \frac{\ln|z| + i(\arg z + 2\pi k)}{\ln|b| + i\arg b}" />
                  <li><InlineMath math="\sqrt[n]{z}" /> — n-й корень:</li>
                  <BlockMath math="z^{1/n} = r^{1/n} e^{i(\theta + 2\pi k)/n}" />
                </ul>
              </Collapsible>

              <Collapsible title="Синтаксис ввода выражений">
                <p>Приложение поддерживает стандартный математический синтаксис. Примеры:</p>
                <ul>
                  <li><code>z</code> — переменная</li>
                  <li><code>i</code> — мнимая единица</li>
                  <li><code>pi</code>, <code>e</code> — математические константы</li>
                </ul>

                <p><strong>Операции:</strong></p>
                <ul>
                  <li><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> — арифметические</li>
                  <li><code>^</code> — возведение в степень: <InlineMath math="z^2" /></li>
                  <li><code>-</code> перед выражением — унарный минус</li>
                </ul>

                <p><strong>Функции одного аргумента:</strong></p>
                <ul>
                  <li><code>sin(z)</code>, <code>cos(z)</code>, <code>tg(z)</code>, <code>abs(z)</code>, <code>ln(z)</code>, <code>phi(z)</code></li>
                  <li><code>sh(z)</code>, <code>ch(z)</code>, <code>th(z)</code>, <code>cth(z)</code></li>
                </ul>

                <p><strong>Функция двух аргументов:</strong></p>
                <ul>
                  <li><code>root(z, n)</code> — корень n-й степени</li>
                </ul>

                <p><strong>Примеры допустимых выражений:</strong></p>
                <ul>
                  <li><code>z^2 + 3*i - 1</code></li>
                  <li><code>Ln(z)</code></li>
                  <li><code>abs(root(z^2 + 1, 3))</code></li>
                </ul>
              </Collapsible>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
