
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
