"use strict";
// Considere um modelo de informação, onde um registro é representado por uma "tupla".
// Uma tupla (ou lista) nesse contexto é chamado de fato.

// Exemplo de um fato:
// ('joão', 'idade', 18, true)

// Nessa representação, a entidade 'joão' tem o atributo 'idade' com o valor '18'.

// Para indicar a remoção (ou retração) de uma informação, o quarto elemento da tupla pode ser 'false'
// para representar que a entidade não tem mais aquele valor associado aquele atributo.


// Como é comum em um modelo de entidades, os atributos de uma entidade pode ter cardinalidade 1 ou N (muitos).

// Segue um exemplo de fatos no formato de tuplas (E, A, V, added?)
// i.e. [entidade, atributo, valor, booleano indica se fato foi adicionado ou retraido)

var facts = [
  ['gabriel', 'endereço', 'av rio branco, 109', true],
  ['joão', 'endereço', 'rua alice, 10', true],
  ['joão', 'endereço', 'rua bob, 88', true],
  ['joão', 'telefone', '234-5678', true],
  ['joão', 'telefone', '91234-5555', true],
  ['joão', 'telefone', '234-5678', false],
  ['gabriel', 'telefone', '98888-1111', true],
  ['gabriel', 'telefone', '56789-1010', true],
];

// Vamos assumir que essa lista de fatos está ordenada dos mais antigos para os mais recentes.

// Nesse schema,
// o atributo 'telefone' tem cardinalidade 'muitos' (one-to-many), e 'endereço' é 'one-to-one'.
var schema = [
    ['endereço', 'cardinality', 'one'],
    ['telefone', 'cardinality', 'many']
];


// Nesse exemplo, os seguintes registros representam o histórico de endereços que joão já teve:
//  [
//   ['joão', 'endereço', 'rua alice, 10', true]
//   ['joão', 'endereço', 'rua bob, 88', true],
//]
// E o fato considerado vigente é o último.

// O objetivo desse desafio é escrever uma função que retorne quais são os fatos vigentes sobre essas entidades.
// Ou seja, quais são as informações que estão valendo no momento atual.
// A função deve receber `facts` (todos fatos conhecidos) e `schema` como argumentos.

// Resultado esperado para este exemplo (mas não precisa ser nessa ordem):
/*[
  ['gabriel', 'endereço', 'av rio branco, 109', true],
  ['joão', 'endereço', 'rua bob, 88', true],
  ['joão', 'telefone', '91234-5555', true],
  ['gabriel', 'telefone', '98888-1111', true],
  ['gabriel', 'telefone', '56789-1010', true]
];*/

function actual_facts(facts, schema) { // Solução.

    var many = {}; // Objeto temporário.
    var one = {}; // Objeto temporário.
    var actual_facts = []; /* Vai obter os fatos vigentes e ser retornado
    no fim.*/

    for (var f_l = facts.length-1; f_l > -1; f_l--) { /* Para cada elemento
        de facts, verifica qual é a cardinalidade do atributo no loop abaixo.*/
        for(var i = 0; i < schema.length; ++i){
            if (schema[i][0] == facts[f_l][1]){ /* Cada atributo em schema é
                comparado com o atributo em facts*/
                if(schema[i][2] == 'many'){
                    if(many[facts[f_l][1]] === undefined){ /* Se não
                        houver um atributo igual ao do fato f_l no objeto
                        many, esse atributo é gravado nesse objeto para
                        servir de fonte de consulta nos próximos passos do loop
                        superior. O array actual_facts recebe esse fato.*/
                        many[facts[f_l][1]] = {};
                        many[facts[f_l][1]][facts[f_l][2]] = null;
                        if(facts[f_l][3]){ /* Ao adicionar os fatos apenas
                            quando added? = true, evita que os fatos retirados
                            sejam adicionados ao resultado final. Já os objetos
                            temporários recebem todos os fatos, dessa forma,
                            como os fatos são lidos do final para o inicio, se
                            o fato retirado for encontrado mais adiante, ele
                            terá sua adição recusada pela lógica do programa,
                            pois já existirá uma ocorrência no objeto temporário*/
                            actual_facts.push(facts[f_l]);
                        }
                    }else{ /* Se houver um atributo igual ao do fato f_l no
                    objeto many, então ocorre um novo teste.*/
                        if(many[facts[f_l][1]][facts[f_l][2]] === undefined){
                            /* Se nesse atributo encontrado não houver o valor
                            do atributo no fato f_l, então esse valor é guardado
                            em many. Dessa forma, nos próximos fatos do loop,
                            se um atributo one-to-many for encontrado no objeto
                            many, nada nesse momento será adicionado em actual_facts*/
                            many[facts[f_l][1]][facts[f_l][2]] = null;
                            if(facts[f_l][3]){
                                actual_facts.push(facts[f_l]);
                            }
                        }
                    }
                }else{
                    if(one[facts[f_l][1]] === undefined){ /* Se não houver um
                        atributo igual ao do fato f_l no objeto one, esse
                        atributo é gravado nesse objeto para servir de fonte de
                        consulta nos próximos passos do loop superior. O array
                        actual_facts recebe esse fato.*/
                        one[facts[f_l][1]] = [{}, {}];
                        one[facts[f_l][1]][0][facts[f_l][0]] = null;
                        one[facts[f_l][1]][1][facts[f_l][2]] = null;
                        if(facts[f_l][3]){
                            actual_facts.push(facts[f_l]);
                        }
                    }else{
                        if(one[facts[f_l][1]][1][facts[f_l][2]] === undefined){
                            /* Se nesse atributo encontrado houver o valor
                            do atributo no fato f_l e sua respectiva entidade,
                            então esses valores são guardados em one. Dessa
                            forma, nos próximos fatos do loop, se um atributo
                            one-to-one for encontrado no objeto many, nada nesse
                            momento será adicionado em actual_facts.*/
                            if(one[facts[f_l][1]][0][facts[f_l][0]] === undefined){
                                one[facts[f_l][1]][1][facts[f_l][2]] = null;
                                one[facts[f_l][1]][0][facts[f_l][0]] = null;
                                if(facts[f_l][3]){
                                    actual_facts.push(facts[f_l]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return actual_facts;
}


var actual_facts = actual_facts(facts, schema);


console.log(actual_facts);
