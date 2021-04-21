import React from 'react';

function EditMovie(props) {
    return (
        <div className="container text-white">
            <div className="row mb-5">
                <div className="col-lg-2 text-center">
                    <img className="editting-thumbnail mb-3" src="https://m.media-amazon.com/images/M/MV5BMWZiYzhlMjgtMDRjMS00MDRhLTgzMjctMzAxYjU2YTBjZjU1XkEyXkFqcGdeQXVyNDQxNjcxNQ@@._V1_.jpg"/>
                </div>
                <div className="col-lg-8">
                    <h3 className="mb-3">Edit Movie: <b>Saigon In My Heart</b></h3>
                    <form>
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="title">Title</label>
                                    <input type="text" id="title" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="alt-title">Alternative Title</label>
                                    <input type="text" id="alt-title" className="form-control border"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="thumbnail">Thumbnail URL</label>
                                    <input type="text" id="thumbnail" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="year">Year</label>
                                    <input type="text" id="year" className="form-control border"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 mb-2">
                                <button type="submit" className="btn btn-white btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                            <div className="col-md-2 mb-2">
                                <button type="submit" className="btn btn-danger btn-block"><i class="fas fa-trash-alt me-1"></i>Delete</button>
                            </div>
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-warning btn-block"><i class="fas fa-save me-1"></i>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d-flex justify-content-start align-items-center mb-2">
                        <h3 className="me-2">Movie Episodes</h3>
                        <button className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i class="fas fa-plus me-1"></i>Add episode</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-bordered table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Progress</th>
                                    <th scope="col">URL</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th scope="row">1</th>
                                    <td className="text-start"><a href="#" className="text-white">Episode #1 [Vietsub]</a></td>
                                    <td>02:30:00</td>
                                    <td>100%</td>
                                    <td><a href="#">Link</a></td>
                                    <td><span className="text-success">Ready</span></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td className="text-start"><a href="#" className="text-white">Episode #2 [Vietsub]</a></td>
                                    <td>02:30:00</td>
                                    <td>0%</td>
                                    <td><a href="#">Link</a></td>
                                    <td><span className="text-warning">Processing [75%]</span></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td className="text-start"><a href="#" className="text-white">Episode #3 [Vietsub]</a></td>
                                    <td>02:30:00</td>
                                    <td>0%</td>
                                    <td><a href="#">Link</a></td>
                                    <td><span className="text-danger">In Queue [#3]</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditMovie;